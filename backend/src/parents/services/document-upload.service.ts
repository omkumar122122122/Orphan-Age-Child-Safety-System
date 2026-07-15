import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  DOCUMENT_UPLOAD_DIR,
} from '../constants/parent.constants';
import { UploadedFileInfo } from '../interfaces/parent.interface';

@Injectable()
export class DocumentUploadService {
  private readonly logger = new Logger(DocumentUploadService.name);
  private readonly uploadRoot: string;

  constructor(private readonly configService: ConfigService) {
    // Resolve upload root relative to CWD (project root)
    this.uploadRoot = path.resolve(process.cwd(), DOCUMENT_UPLOAD_DIR);
    this.ensureUploadDir();
  }

  // ─────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_DOCUMENT_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      const maxMb = MAX_DOCUMENT_SIZE_BYTES / (1024 * 1024);
      throw new BadRequestException(
        `File too large. Maximum size is ${maxMb} MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      );
    }
  }

  // ─────────────────────────────────────────────
  // Save to disk
  // ─────────────────────────────────────────────

  async saveFile(
    file: Express.Multer.File,
    parentId: string,
  ): Promise<UploadedFileInfo> {
    this.validateFile(file);

    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueFileName = `${parentId}_${uuidv4()}${ext}`;
    const parentDir = path.join(this.uploadRoot, parentId);

    // Create parent-scoped subdirectory
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const absolutePath = path.join(parentDir, uniqueFileName);
    const relativePath = path.join(DOCUMENT_UPLOAD_DIR, parentId, uniqueFileName);

    try {
      // Write buffer to disk
      await fs.promises.writeFile(absolutePath, file.buffer);
      this.logger.log(`Document saved: ${relativePath}`);
    } catch (err) {
      this.logger.error('Failed to write file to disk', err.stack);
      throw new InternalServerErrorException('Failed to save uploaded document');
    }

    const baseUrl = this.configService.get<string>('app.frontendUrl', 'http://localhost:3000');
    const storageUrl = `${baseUrl}/uploads/parent-documents/${parentId}/${uniqueFileName}`;

    return {
      fileName: uniqueFileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath: relativePath,
      storageUrl,
    };
  }

  // ─────────────────────────────────────────────
  // Delete from disk
  // ─────────────────────────────────────────────

  async deleteFile(storagePath: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), storagePath);
    try {
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        this.logger.log(`Document deleted: ${storagePath}`);
      }
    } catch (err) {
      // Log but don't throw — file cleanup failure shouldn't block the operation
      this.logger.warn(`Failed to delete file: ${storagePath}`, err.stack);
    }
  }

  // ─────────────────────────────────────────────
  // Utility
  // ─────────────────────────────────────────────

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadRoot)) {
      fs.mkdirSync(this.uploadRoot, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadRoot}`);
    }
  }

  /**
   * Returns the multer memoryStorage config object to be used in the controller.
   * S3 swap: replace the saveFile() method with an AWS S3 putObject call
   * and return the S3 URL as storageUrl without touching this method.
   */
  getMulterConfig() {
    return {
      storage: 'memory', // multer memoryStorage — files arrive as Buffer
      limits: {
        fileSize: MAX_DOCUMENT_SIZE_BYTES,
        files: 1,
      },
      fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        if (ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Invalid file type. Allowed: ${ALLOWED_DOCUMENT_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
        }
      },
    };
  }
}
