const API = import.meta.env.VITE_API_URL ?? "";

export function getToken(): string | null {
  return localStorage.getItem("wfrp-token");
}

export function removeToken(): void {
  localStorage.removeItem("wfrp-token");
}

export function saveToken(token: string): void {
  localStorage.setItem("wfrp-token", token);
}

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) return undefined as unknown as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      window.location.reload();
    }
    throw new Error((data as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }

  return data as T;
}