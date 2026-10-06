import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { pickLocalized } from "@/lib/data/defaults";
import type { CloudinaryAsset, Locale } from "@/types/cms";
import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  asset?: CloudinaryAsset | null;
  locale?: Locale;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

export function CmsImage({
  asset,
  locale = "en",
  fill,
  className,
  priority,
  sizes,
  width,
  height,
}: Props) {
  if (!asset?.url) return null;
  const src = asset.publicId
    ? cloudinaryUrl(asset.publicId, { width: width ?? 1600 })
    : asset.url;
  const alt = asset.alt ? pickLocalized(asset.alt, locale) : "";

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
