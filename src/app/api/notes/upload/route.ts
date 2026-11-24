import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/user";
import { UTApi } from "uploadthing/server";

const token =
  process.env.UPLOADTHING_TOKEN ||
  "eyJhcGlLZXkiOiJza19saXZlX2FkOWE4ZmIyOTI5YTNjYjM2Y2Y3MjRjMzA0YmFhMmE2M2U5ZGZjNWUwYzE4M2M2OGU3OTdhNTU3NmEyMDlkMTIiLCJhcHBJZCI6Ijd3eWRzMWQxdHUiLCJyZWdpb25zIjpbInNlYTEiXX0=";

const utapi = new UTApi({ token });

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type is PDF
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Upload to UploadThing cloud storage
    const response = await utapi.uploadFiles(file);

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: 500 });
    }

    const fileUrl = (response.data as any)?.ufsUrl || response.data?.url;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
