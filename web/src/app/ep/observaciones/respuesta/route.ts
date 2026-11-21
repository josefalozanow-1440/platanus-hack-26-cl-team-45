import { API_URL } from "@/lib/api";

// Proxies the single answer download so the browser never needs to reach the API directly.
export async function GET(request: Request) {
  const comite = new URL(request.url).searchParams.get("comite") ?? "";
  const response = await fetch(`${API_URL}/ep/comites/${encodeURIComponent(comite)}/respuesta`, { cache: "no-store" });
  const headers = new Headers();
  for (const name of ["content-type", "content-disposition"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(await response.text(), { status: response.status, headers });
}
