import path from 'path';
import * as fs from 'fs';

export function updateListImagePath(
  authorId: string,
  files: Record<string, Express.Multer.File[]>
) {
  const listImage: { fileName: string; filePath: string; field: string }[] = [];
  // 2. Rename dan pindah file
  Object.entries(files).forEach(([field, fileArray]) => {
    const file = fileArray[0]; // ambil satu saja karena maxCount: 1
    const dirPath = path.join('uploads', field);
    const newName = `${authorId}_${file.originalname}`;
    const newPath = path.join(dirPath, newName);

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    listImage.push({
      fileName: newName,
      filePath: newPath,
      field,
    });
    fs.renameSync(file.path, newPath);
  });

  return listImage;
}
