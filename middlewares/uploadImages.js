import path from "path";
import { promises as fs } from "fs";

export const uploadImages = async (data) => {
  const formData = data;

  // Check if no files were uploaded
  if (formData.length === 0) {
    return { error: "No files received.", status: 400 };
  }

  // Check if too many files are uploaded
  if (formData.length > 5) {
    return { error: "Maximum 5 files allowed.", status: 400 };
  }

  const uploadPromises = [];
  const fileNames = [];

  // Process each file
  for (const file of formData) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/uploads/", filename);
    const relativePath = filePath
      .replace(process.cwd(), "")
      .replace(/\\/g, "/");
    const uploadsPath = `${filename}`;

    uploadPromises.push(fs.writeFile(filePath, buffer));
    fileNames.push(uploadsPath);
  }

  try {
    await Promise.all(uploadPromises);
    return {
      message: "All images uploaded successfully!",
      fileNames,
      status: 201,
    };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { message: "Failed to upload some or all images.", status: 500 };
  }
};

