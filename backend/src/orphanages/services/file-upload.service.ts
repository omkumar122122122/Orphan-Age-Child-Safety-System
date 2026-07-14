import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes: string[] = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    subDirectory: string = '',
  ): Promise<{ url: string; path: string; filename: string }> {
    // Validate file
    this.validateFile(file);

    // Create subdirectory if specified
    const targetDir = path.join(this.uploadDir, subDirectory);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(targetDir, filename);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return file info
    return {
      url: `/uploads/${subDirectory}/${filename}`,
      path: filePath,
      filename,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    subDirectory: string = '',
  ): Promise<Array<{ url: string; path: string; filename: string }>> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, subDirectory),
    );
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // Check if file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }
  }

  getFileExtension(filename: string): string {
    return path.extname(filename);
  }

  isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  isPdfFile(mimetype: string): boolean {
    return mimetype === 'application/pdf';
  }
}
