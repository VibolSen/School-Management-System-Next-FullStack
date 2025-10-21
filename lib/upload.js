import fs from 'fs/promises';
import path from 'path';

export async function saveFile(file) {
  const uploadDir = path.join(process.cwd(), 'public', 'upload');
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, filename);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);

  return `/upload/${filename}`;
}
