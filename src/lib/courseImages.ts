export type CourseImage = {
  role: "front_cover" | "back_cover" | "material";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  data: string;
};

export async function encodeCourseImage(file: File, role: CourseImage["role"]): Promise<CourseImage> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use JPG, PNG, or WebP images.");
  }
  if (file.size > 4_000_000) throw new Error(`${file.name} is larger than 4 MB. Compress it first.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let start = 0; start < bytes.length; start += 32_768) {
    binary += String.fromCharCode(...bytes.subarray(start, start + 32_768));
  }
  return { role, mimeType: file.type as CourseImage["mimeType"], data: btoa(binary) };
}
