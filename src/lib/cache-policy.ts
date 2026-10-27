export function applyCachePolicy(request: Request, response: Response): Response {
  const path = new URL(request.url).pathname;
  const contentType = response.headers.get("content-type") ?? "";
  const sensitivePath =
    /^\/(?:admin(?:\/|$)|reserver(?:\/|$)|bon-plan(?:\/|$)|infos(?:\/|$)|api\/|_server)/.test(path);
  if (!contentType.includes("text/html") && !sensitivePath) return response;

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
