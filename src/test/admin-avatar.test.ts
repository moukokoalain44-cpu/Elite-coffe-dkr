import { afterEach, describe, expect, it, vi } from "vitest";
import {
  inlineAvatarToFile,
  isInlineAvatarDataUri,
  saveAdminAvatarProfile,
} from "@/lib/admin-avatar";

describe("admin avatar migration", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("recognizes legacy inline image metadata but not a stored URL", () => {
    expect(isInlineAvatarDataUri("data:image/jpeg;base64,Zm9v")).toBe(true);
    expect(isInlineAvatarDataUri("https://storage.example/avatar.webp")).toBe(false);
    expect(isInlineAvatarDataUri(null)).toBe(false);
  });

  it("converts the legacy data URI to a File without returning the data URI", async () => {
    const dataUri = "data:image/jpeg;base64,Zm9v";
    const blob = new Blob([new Uint8Array([102, 111, 111])], { type: "image/jpeg" });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, blob: async () => blob });
    vi.stubGlobal("fetch", fetchMock);

    const file = await inlineAvatarToFile(dataUri);

    expect(fetchMock).toHaveBeenCalledWith(dataUri);
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("admin-avatar.jpg");
    expect(file.type).toBe("image/jpeg");
    expect(file.size).toBe(3);
  });

  it("rejects unsupported values before fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(inlineAvatarToFile("https://storage.example/avatar.jpg")).rejects.toThrow(
      "data URI",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears legacy inline metadata before upload and stores only the Storage URL", async () => {
    const dataUri = "data:image/jpeg;base64,Zm9v";
    const blob = new Blob([new Uint8Array([102, 111, 111])], { type: "image/jpeg" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, blob: async () => blob }));
    const steps: string[] = [];
    const updateProfile = vi.fn(async (profile: { name: string; avatar: string | null }) => {
      steps.push(`profile:${profile.avatar ?? "null"}`);
    });
    const uploadFile = vi.fn(async () => {
      steps.push("upload");
      return "https://storage.example/site/admin-avatar/avatar.webp";
    });

    const savedAvatar = await saveAdminAvatarProfile({
      name: "Admin",
      avatar: dataUri,
      avatarFile: null,
      updateProfile,
      uploadFile,
    });

    expect(steps).toEqual([
      "profile:null",
      "upload",
      "profile:https://storage.example/site/admin-avatar/avatar.webp",
    ]);
    expect(uploadFile).toHaveBeenCalledWith(expect.objectContaining({ name: "admin-avatar.jpg" }));
    expect(savedAvatar).toBe("https://storage.example/site/admin-avatar/avatar.webp");
    expect(
      updateProfile.mock.calls.every(([profile]) => !profile.avatar?.startsWith("data:")),
    ).toBe(true);
  });

  it("stores a newly selected avatar without retaining its bytes in metadata", async () => {
    const selectedFile = new File([new Uint8Array([1, 2])], "new-avatar.png", {
      type: "image/png",
    });
    const updateProfile = vi.fn().mockResolvedValue(undefined);
    const uploadFile = vi
      .fn()
      .mockResolvedValue("https://storage.example/site/admin-avatar/new.webp");

    await saveAdminAvatarProfile({
      name: "Admin",
      avatar: "https://storage.example/site/admin-avatar/old.webp",
      avatarFile: selectedFile,
      updateProfile,
      uploadFile,
    });

    expect(uploadFile).toHaveBeenCalledWith(selectedFile);
    expect(updateProfile).toHaveBeenCalledTimes(1);
    expect(updateProfile).toHaveBeenCalledWith({
      name: "Admin",
      avatar: "https://storage.example/site/admin-avatar/new.webp",
    });
  });
});
