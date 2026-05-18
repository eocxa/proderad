import fs from "fs";
import path from "path";

const TOKENS_PATH = path.join(process.cwd(), "src/lib/google-tokens.json");

// Obtener credenciales desde variables de entorno o archivo de configuración
export function getClientId(): string {
  const tokens = getStoredTokens();
  return process.env.GOOGLE_CLIENT_ID || tokens?.client_id || "TU_GOOGLE_CLIENT_ID";
}

export function getClientSecret(): string {
  const tokens = getStoredTokens();
  return process.env.GOOGLE_CLIENT_SECRET || tokens?.client_secret || "TU_GOOGLE_CLIENT_SECRET";
}

// URI de redirección local (se le indicará al usuario que la agregue a su consola de Google)
// Si está en producción, usar el de vercel.
const getRedirectUri = (reqUrl?: string) => {
  if (reqUrl && reqUrl.includes("localhost")) {
    return "http://localhost:3000/api/auth/google/callback";
  }
  return "https://demoprodentalradiologia.vercel.app/api/auth/google/callback";
};

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number; // Timestamp ms
  calendar_id?: string;
}

export function saveTokens(tokens: GoogleTokens) {
  let existingTokens: Partial<GoogleTokens> = {};
  if (fs.existsSync(TOKENS_PATH)) {
    try {
      existingTokens = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf8"));
    } catch {}
  }

  const merged = {
    ...existingTokens,
    ...tokens,
    // Asegurar que no perdemos el refresh token si no viene en esta actualización
    refresh_token: tokens.refresh_token || existingTokens.refresh_token,
    calendar_id: tokens.calendar_id || existingTokens.calendar_id || "primary",
    client_id: tokens.client_id || existingTokens.client_id,
    client_secret: tokens.client_secret || existingTokens.client_secret,
  };

  fs.writeFileSync(TOKENS_PATH, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}

export function getStoredTokens(): GoogleTokens | null {
  if (!fs.existsSync(TOKENS_PATH)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf8"));
    if (data.access_token) return data as GoogleTokens;
  } catch {}
  return null;
}

// Genera la URL para que el admin inicie sesión en Google
export function getAuthUrl(reqUrl: string) {
  const redirectUri = getRedirectUri(reqUrl);
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectUri,
    client_id: getClientId(),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly"
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

// Intercambiar código temporal por Tokens (Access y Refresh)
export async function getTokensFromCode(code: string, reqUrl: string): Promise<GoogleTokens> {
  const redirectUri = getRedirectUri(reqUrl);
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: getClientId(),
    client_secret: getClientSecret(),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to exchange code: ${errText}`);
  }

  const data = await res.json();
  const tokens: GoogleTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    scope: data.scope,
    token_type: data.token_type,
    expiry_date: Date.now() + data.expires_in * 1000,
  };

  return saveTokens(tokens);
}

// Refrescar el access_token cuando ha caducado
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    client_id: getClientId(),
    client_secret: getClientSecret(),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values).toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await res.json();
  const stored = getStoredTokens();
  
  if (stored) {
    const updated: GoogleTokens = {
      ...stored,
      access_token: data.access_token,
      expiry_date: Date.now() + data.expires_in * 1000,
    };
    saveTokens(updated);
  }

  return data.access_token;
}

// Obtener un access_token válido (refrescándolo de ser necesario)
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  // Si expira en menos de 5 minutos, refrescar
  const isExpired = Date.now() + 5 * 60 * 1000 > tokens.expiry_date;
  
  if (isExpired && tokens.refresh_token) {
    try {
      return await refreshAccessToken(tokens.refresh_token);
    } catch (e) {
      console.error("Error refreshing token:", e);
      return null;
    }
  }

  return tokens.access_token;
}

// Crear un evento real en Google Calendar
export async function createGoogleCalendarEvent(eventData: {
  summary: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string;   // HH:MM
}) {
  const accessToken = await getValidAccessToken();
  if (!accessToken) return null;

  const tokens = getStoredTokens();
  const calendarId = tokens?.calendar_id || "primary";

  let startDateTime = "";
  let endDateTime = "";

  if (eventData.startTime) {
    startDateTime = `${eventData.startDate}T${eventData.startTime}:00`;
    // Si no hay endTime, sumar 1 hora
    if (eventData.endTime) {
      endDateTime = `${eventData.startDate}T${eventData.endTime}:00`;
    } else {
      const [h, m] = eventData.startTime.split(":").map(Number);
      const nextHour = `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      endDateTime = `${eventData.startDate}T${nextHour}:00`;
    }
  }

  const eventBody: any = {
    summary: eventData.summary,
    description: eventData.description,
    start: startDateTime 
      ? { dateTime: startDateTime, timeZone: "America/Mexico_City" }
      : { date: eventData.startDate },
    end: endDateTime
      ? { dateTime: endDateTime, timeZone: "America/Mexico_City" }
      : { date: eventData.endDate || eventData.startDate },
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventBody),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error creating Google Calendar Event:", err);
    return null;
  }

  return await res.json();
}
