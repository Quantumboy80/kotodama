import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = (file as any).ufsUrl || file.url;
      return { uploadedBy: "user", url: fileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
