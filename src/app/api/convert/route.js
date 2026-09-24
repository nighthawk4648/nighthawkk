import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name || "plugin.zip";
    const rbzFilename = filename.replace(/\.zip$/i, ".rbz");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-zip-compressed",
        "Content-Disposition": `attachment; filename="${rbzFilename}"`,
      },
    });
  } catch (error) {
    console.error("RBZ conversion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
