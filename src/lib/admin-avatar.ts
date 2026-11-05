const INLINE_AVATAR_DATA_URI = /^data:image\/(?:jpeg|png|webp|avif);base64,/i;

export function isInlineAvatarDataUri(value: string | null | undefined): value is string {
  return typeof value === "string" && INLINE_AVATAR_DATA_URI.test(value);
}

export async function inlineAvatarToFile(dataUri: string): Promise<File> {
  if (!isInlineAvatarDataUri(dataUri)) {
    throw new Error("L’ancien avatar n’est pas une image data URI prise en charge.");
  }

  const response = await fetch(dataUri);
  if (!response.ok) throw new Error("Impossible de lire l’ancien avatar à migrer.");
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("Le contenu de l’ancien avatar n’est pas une image valide.");
  }

  const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "img";
  return new File([blob], `admin-avatar.${extension}`, { type: blob.type });
}

type SaveAdminAvatarProfileOptions = {
  name: string;
  avatar: string;
  avatarFile: File | null;
  updateProfile: (profile: { name: string; avatar: string | null }) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
};

export async function saveAdminAvatarProfile({
  name,
  avatar,
  avatarFile,
  updateProfile,
  uploadFile,
}: SaveAdminAvatarProfileOptions): Promise<string> {
  const hasLegacyInlineAvatar = isInlineAvatarDataUri(avatar);
  let fileToUpload = avatarFile;
  if (!fileToUpload && hasLegacyInlineAvatar) {
    fileToUpload = await inlineAvatarToFile(avatar);
  }

  if (fileToUpload && hasLegacyInlineAvatar) {
    // Replace the oversized JWT claim before making the Storage request.
    await updateProfile({ name, avatar: null });
  }

  const nextAvatar = fileToUpload ? await uploadFile(fileToUpload) : avatar;
  await updateProfile({ name, avatar: nextAvatar || null });
  return nextAvatar;
}
