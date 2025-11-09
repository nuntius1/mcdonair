# S3 Bucket Setup Guide for McDonair

## Step 1: Create S3 Bucket

1. Go to AWS S3 Console
2. Click "Create bucket"
3. Bucket name: `mcdonair`
4. AWS Region: Choose your region (e.g., `us-east-1`)
5. **Block Public Access settings**: 
   - Uncheck "Block all public access" (or configure as needed)
   - Acknowledge the warning
6. Click "Create bucket"

## Step 2: Configure Bucket Policy

1. Go to your `mcdonair` bucket
2. Click on the "Permissions" tab
3. Scroll down to "Bucket policy"
4. Click "Edit"
5. Paste the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mcdonair/*"
    }
  ]
}
```

6. Click "Save changes"

## Step 3: Configure CORS (Optional but Recommended)

1. Still in the "Permissions" tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Click "Edit"
4. Paste the following CORS configuration:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5001",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

5. Replace `https://yourdomain.com` with your actual domain
6. Click "Save changes"

## Step 4: Create IAM User for Application

1. Go to AWS IAM Console
2. Click "Users" → "Create user"
3. User name: `mcdonair-app-user`
4. Click "Next"
5. Select "Attach policies directly"
6. Click "Create policy"
7. Use JSON tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mcdonair/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mcdonair"
    }
  ]
}
```

8. Name the policy: `mcdonair-s3-access`
9. Click "Create policy"
10. Go back to user creation, refresh policies, select `mcdonair-s3-access`
11. Click "Next" → "Create user"
12. Click on the user → "Security credentials" tab
13. Click "Create access key"
14. Select "Application running outside AWS"
15. Click "Next" → "Create access key"
16. **Save the Access Key ID and Secret Access Key** (you'll need these for your .env file)

## Step 5: Add to .env File

Add these to your backend `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=mcdonair
```

## Important Notes:

- **Public Read Access**: The bucket policy allows public read access to all objects. This means anyone with the URL can view the images. If you need more security, you can restrict this.
- **IAM User**: The IAM user has permissions to upload/delete files. Keep the credentials secure.
- **CORS**: Configure CORS if you're accessing images from a different domain than your S3 bucket.

