declare module 'multer-s3' {
  import { S3Client } from '@aws-sdk/client-s3';
  import multer from 'multer';

  interface MulterS3StorageOptions {
    s3: S3Client;
    bucket: string;
    metadata?: (req: any, file: any, cb: (error: any, metadata?: any) => void) => void;
    key?: (req: any, file: any, cb: (error: any, key?: string) => void) => void;
    contentType?: any;
  }

  function multerS3(options: MulterS3StorageOptions): multer.StorageEngine;
  export = multerS3;
} 