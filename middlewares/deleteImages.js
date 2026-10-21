import path from "path";
import { unlink } from "fs/promises";

export const deleteImages = async (image) => {
  const fileToDelete = path.join(process.cwd(), "public/uploads/", image);
  await unlink(fileToDelete);
  console.log(`${image} deleted successfully!`);
};
