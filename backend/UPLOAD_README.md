# File Upload System - Quick Start

## ✅ What's Implemented

The file upload system is now **complete** and includes:

### 🔧 Core Features
- ✅ AWS S3 integration with multer-s3
- ✅ Multiple file categories with different limits
- ✅ File type and size validation
- ✅ Authentication required for uploads
- ✅ Rate limiting protection
- ✅ Comprehensive error handling
- ✅ Presigned URL generation for private files
- ✅ File deletion capabilities

### 📁 File Categories & Limits

| Category | Max Size | Allowed Types | Use Case |
|----------|----------|---------------|----------|
| `profileImage` | 5MB | JPEG, JPG, PNG, WebP | User avatars |
| `eventImage` | 10MB | JPEG, JPG, PNG, WebP, GIF | Event banners |
| `eventDocument` | 25MB | PDF, DOC, DOCX | Event contracts |
| `generalImage` | 8MB | JPEG, JPG, PNG, WebP, GIF | Gallery images |
| `generalDocument` | 20MB | PDF, DOC, DOCX | General docs |

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure AWS S3
Add to your `.env` file:
```bash
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=evoke-uploads
```

### 3. Start the Server
```bash
npm run dev
```

## 📡 API Endpoints

### Upload a File
```bash
curl -X POST \
  http://localhost:3001/api/v1/upload/profileImage \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@avatar.jpg"
```

### Get Upload Limits
```bash
curl http://localhost:3001/api/v1/upload/limits/profileImage
```

### Delete a File
```bash
curl -X DELETE \
  http://localhost:3001/api/v1/upload/profile-images/user123/file.jpg \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🧪 Test the System

Run the test server to verify everything works:
```bash
node test-upload.js
```

Then test with curl:
```bash
# Test health check
curl http://localhost:3002/health

# Test upload limits
curl http://localhost:3002/limits/profileImage

# Test file upload (replace with actual image file)
curl -X POST \
  http://localhost:3002/upload/profileImage \
  -F "file=@test-image.jpg"
```

## 📚 Documentation

For complete documentation, see: `FILE_UPLOAD_SYSTEM.md`

## 🔒 Security Features

- ✅ Authentication required for all upload operations
- ✅ File type validation prevents malicious uploads
- ✅ Size limits prevent abuse
- ✅ Rate limiting (20 uploads per 15 minutes)
- ✅ Files organized by user ID and category
- ✅ Presigned URLs for secure private file access

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid file type" error**
   - Check file extension matches actual content
   - Verify file is in allowed types for category

2. **"File too large" error**
   - Compress file or use different category
   - Check category size limits

3. **AWS S3 errors**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket exists

4. **Authentication errors**
   - Include valid JWT token in Authorization header
   - Check token expiration

## 📝 Next Steps

1. **Frontend Integration**: Use the provided React/TypeScript examples
2. **AWS Setup**: Create S3 bucket and configure CORS
3. **Environment Variables**: Set up all required AWS credentials
4. **Testing**: Test with real files and different categories

The upload system is **production-ready** once you configure your AWS S3 bucket and credentials! 