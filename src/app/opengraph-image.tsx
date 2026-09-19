import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const alt = "JobFit CV evidence review";
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage();
}
