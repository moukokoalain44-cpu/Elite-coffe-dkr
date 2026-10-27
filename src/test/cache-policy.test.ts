import { describe, expect, it } from "vitest";
import { applyCachePolicy } from "@/lib/cache-policy";

describe("Cache policy", () => {
  it("prevents caching HTML pages", () => {
    const request = new Request("https://elite-coffee.example/reserver");
    const response = new Response("<html></html>", {
      headers: { "content-type": "text/html; charset=utf-8" },
    });

    const result = applyCachePolicy(request, response);

    expect(result.headers.get("cache-control")).toBe(
      "private, no-store, max-age=0, must-revalidate",
    );
    expect(result.headers.get("pragma")).toBe("no-cache");
    expect(result.headers.get("expires")).toBe("0");
  });

  it("prevents caching sensitive API responses even when they are JSON", () => {
    const request = new Request("https://elite-coffee.example/api/reservations");
    const response = new Response("{}", {
      headers: { "content-type": "application/json" },
    });

    expect(applyCachePolicy(request, response).headers.get("cache-control")).toContain("no-store");
  });

  it("preserves long-lived caching for fingerprinted static assets", () => {
    const request = new Request("https://elite-coffee.example/assets/app-abc123.js");
    const response = new Response("bundle", {
      headers: {
        "content-type": "application/javascript",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });

    expect(applyCachePolicy(request, response)).toBe(response);
    expect(response.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
  });
});
