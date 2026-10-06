import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getCloudinary() {
  if (!isCloudinaryConfigured()) return null;
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function signUploadParams(timestamp: number) {
  const cloudinaryClient = getCloudinary();
  if (!cloudinaryClient) return null;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "faresboughzela";
  const params = { timestamp, folder };
  const signature = cloudinaryClient.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  };
}
