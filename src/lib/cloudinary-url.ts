export function cloudinaryUrl(
  publicIdOrUrl: string,
  options: { width?: number; height?: number; crop?: string } = {},
): string {
  if (!publicIdOrUrl) return "";
  if (publicIdOrUrl.startsWith("http")) return publicIdOrUrl;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return publicIdOrUrl;
  const transforms = [
    "f_auto",
    "q_auto",
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : "c_limit",
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicIdOrUrl}`;
}
