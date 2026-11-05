import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenuProductImage } from "@/components/MenuProductImage";
import { MediaRenderer } from "@/components/MediaRenderer";
import { DEFAULT_SITE_MEDIA } from "@/hooks/use-site-media";

describe("public media placeholders", () => {
  it("shows an empty official-image frame without emitting an image request", () => {
    const { container } = render(<MenuProductImage alt="Chocolat chaud" />);

    expect(
      screen.getByRole("img", { name: "Chocolat chaud — image officielle à venir" }),
    ).toBeTruthy();
    expect(screen.getByText("Image officielle à venir")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows an empty site-media frame without emitting an image or video request", () => {
    const { container } = render(
      <MediaRenderer media={{ media_type: "image", url: "", alt_text: "Galerie officielle" }} />,
    );

    expect(screen.getByText("Média officiel à venir")).toBeTruthy();
    expect(container.querySelector("img, video")).toBeNull();
  });

  it("keeps default site slots empty until an official upload is saved", () => {
    expect(DEFAULT_SITE_MEDIA.length).toBeGreaterThan(0);
    expect(DEFAULT_SITE_MEDIA.every((media) => media.url === "" && !media.is_visible)).toBe(true);
  });

  it("renders the uploaded URL after an official image is supplied", () => {
    const url = "https://storage.example/menu-images/plats/chocolat.webp";
    const { container } = render(<MenuProductImage src={url} alt="Chocolat chaud" />);

    expect(container.querySelector("img")?.getAttribute("src")).toBe(url);
    expect(screen.queryByText("Image officielle à venir")).toBeNull();
  });
});
