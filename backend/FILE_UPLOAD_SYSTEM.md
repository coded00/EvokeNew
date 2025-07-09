# File Upload System Documentation

## Overview

The Evoke backend includes a comprehensive file upload system using AWS S3 for secure, scalable file storage. The system supports multiple file categories with different size limits and type restrictions.

## Features

- **Multiple File Categories**: Different upload categories with specific size limits and file type restrictions
- **AWS S3 Integration**: Secure cloud storage with automatic file organization
- **Authentication Required**: All upload operations require user authentication
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **File Validation**: Automatic file type and size validation
- **Presigned URLs**: Support for private file access with temporary URLs
- **Error Handling**: Comprehensive error handling with detailed messages

## File Upload Categories & Limits

| Category | Max Size | Allowed Types | Folder | Use Case |
|----------|----------|---------------|---------|----------|
| `profileImage` | 5MB | JPEG, JPG, PNG, WebP | `profile-images/` | User avatars, profile pictures |
| `eventImage` | 10MB | JPEG, JPG, PNG, WebP, GIF | `event-images/` | Event banners, event photos |
| `eventDocument` | 25MB | PDF, DOC, DOCX | `event-documents/` | Event contracts, PDFs |
| `generalImage` | 8MB | JPEG, JPG, PNG, WebP, GIF | `general-images/` | Gallery images, general photos |
| `generalDocument` | 20MB | PDF, DOC, DOCX | `general-documents/` | General documents |

## Setup Instructions

### 1. AWS S3 Configuration

Create an S3 bucket and configure the following environment variables:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=evoke-uploads
```

### 2. S3 Bucket Policy

Ensure your S3 bucket has the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1/upload
```

### 1. Upload File
**POST** `/upload/:category`

Upload a single file to the specified category.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Parameters:**
- `category` (path): One of the valid categories (profileImage, eventImage, etc.)
- `file` (form-data): The file to upload

**Example Request:**
```bash
curl -X POST \
  http://localhost:3001/api/v1/upload/profileImage \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@avatar.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileUrl": "https://evoke-uploads.s3.us-east-1.amazonaws.com/profile-images/user123/avatar_1234567890.jpg",
    "fileKey": "profile-images/user123/avatar_1234567890.jpg",
    "fileName": "avatar.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

### 2. Delete File
**DELETE** `/upload/:fileKey`

Delete a file from S3.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `fileKey` (path): The S3 key of the file to delete

**Example Request:**
```bash
curl -X DELETE \
  http://localhost:3001/api/v1/upload/profile-images/user123/avatar_1234567890.jpg \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 3. Get Upload Limits
**GET** `/upload/limits/:category`

Get upload limits for a specific category.

**Parameters:**
- `category` (path): The category to get limits for

**Example Request:**
```bash
curl http://localhost:3001/api/v1/upload/limits/profileImage
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "category": "profileImage",
    "maxSize": 5242880,
    "maxSizeFormatted": "5 MB",
    "allowedTypes": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    "folder": "profile-images"
  }
}
```

### 4. Get All Upload Limits
**GET** `/upload/limits`

Get upload limits for all categories.

**Example Request:**
```bash
curl http://localhost:3001/api/v1/upload/limits
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": {
      "profileImage": {
        "maxSize": 5242880,
        "maxSizeFormatted": "5 MB",
        "allowedTypes": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        "folder": "profile-images"
      },
      "eventImage": {
        "maxSize": 10485760,
        "maxSizeFormatted": "10 MB",
        "allowedTypes": ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
        "folder": "event-images"
      }
      // ... other categories
    },
    "totalCategories": 5
  }
}
```

### 5. Generate Presigned URL
**GET** `/upload/presigned/:fileKey`

Generate a presigned URL for private file access.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `fileKey` (path): The S3 key of the file
- `expiresIn` (query, optional): URL expiration time in seconds (default: 3600)

**Example Request:**
```bash
curl "http://localhost:3001/api/v1/upload/presigned/profile-images/user123/avatar.jpg?expiresIn=7200" \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://evoke-uploads.s3.us-east-1.amazonaws.com/profile-images/user123/avatar.jpg?X-Amz-Algorithm=...",
    "expiresIn": 7200,
    "fileKey": "profile-images/user123/avatar.jpg"
  }
}
```

### 6. Get File Information
**GET** `/upload/info/:fileKey`

Get metadata for a file.

**Parameters:**
- `fileKey` (path): The S3 key of the file

**Example Request:**
```bash
curl http://localhost:3001/api/v1/upload/info/profile-images/user123/avatar.jpg
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "fileKey": "profile-images/user123/avatar.jpg",
    "contentType": "image/jpeg",
    "contentLength": 1024000,
    "lastModified": "2024-01-15T10:30:00.000Z",
    "metadata": {
      "originalName": "avatar.jpg",
      "uploadedBy": "user123",
      "category": "profileImage",
      "uploadedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Error Responses

### File Too Large (400)
```json
{
  "error": "File too large",
  "message": "The uploaded file exceeds the maximum allowed size"
}
```

### Invalid File Type (400)
```json
{
  "error": "Upload failed",
  "message": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/webp"
}
```

### Invalid Category (400)
```json
{
  "error": "Invalid upload category",
  "message": "Invalid category: invalidCategory. Valid categories: profileImage, eventImage, eventDocument, generalImage, generalDocument"
}
```

### Authentication Required (401)
```json
{
  "error": "Authentication required",
  "message": "User must be authenticated to upload files"
}
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Too many upload attempts",
  "message": "Please try again later"
}
```

## Frontend Integration

### React/TypeScript Example

```typescript
interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    fileUrl: string;
    fileKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
}

const uploadFile = async (file: File, category: string, token: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:3001/api/v1/upload/${category}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Usage
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadFile(file, 'profileImage', userToken);
    if (result.success) {
      console.log('File uploaded:', result.data.fileUrl);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### JavaScript Example

```javascript
const uploadFile = async (file, category, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:3001/api/v1/upload/${category}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Usage
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadFile(file, 'profileImage', userToken);
    if (result.success) {
      console.log('File uploaded:', result.data.fileUrl);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Security Considerations

1. **Authentication**: All upload endpoints require valid JWT tokens
2. **File Type Validation**: Only allowed file types are accepted
3. **Size Limits**: Files are validated against category-specific size limits
4. **Rate Limiting**: Upload endpoints have rate limiting to prevent abuse
5. **CORS**: Proper CORS configuration for cross-origin requests
6. **File Organization**: Files are organized by category and user ID

## Monitoring & Logging

The system includes comprehensive logging for:
- Upload attempts and results
- File deletions
- Error conditions
- Rate limit violations

All logs include user context and file metadata for debugging and monitoring.

## Troubleshooting

### Common Issues

1. **"Invalid file type" error**
   - Check that the file type is in the allowed list for the category
   - Verify the file extension matches the actual content

2. **"File too large" error**
   - Check the file size against the category limit
   - Consider compressing the file or using a different category

3. **"Authentication required" error**
   - Ensure the request includes a valid Authorization header
   - Verify the JWT token is not expired

4. **AWS S3 errors**
   - Verify AWS credentials are correct
   - Check S3 bucket permissions
   - Ensure the bucket exists and is accessible

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

This will provide detailed information about upload operations and AWS interactions. 