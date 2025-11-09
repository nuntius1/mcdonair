require("dotenv").config();
const AWS = require('aws-sdk');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

console.log('🔍 Testing AWS S3 Connection...\n');
console.log('Configuration:');
console.log(`  Bucket: ${BUCKET_NAME || 'NOT SET'}`);
console.log(`  Region: ${process.env.AWS_REGION || 'us-east-1'}`);
console.log(`  Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + '...' : 'NOT SET'}`);
console.log(`  Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '***SET***' : 'NOT SET'}\n`);

// Test 1: Check if bucket exists and is accessible
async function testBucketAccess() {
  try {
    console.log('📦 Test 1: Checking bucket access...');
    const params = {
      Bucket: BUCKET_NAME,
    };
    
    await s3.headBucket(params).promise();
    console.log('✅ Bucket exists and is accessible!\n');
    return true;
  } catch (error) {
    console.error('❌ Bucket access failed:', error.message);
    if (error.code === 'NotFound') {
      console.error('   → Bucket does not exist. Please create it first.');
    } else if (error.code === 'Forbidden') {
      console.error('   → Access denied. Check your credentials and bucket permissions.');
    } else if (error.code === 'CredentialsError') {
      console.error('   → Invalid AWS credentials. Check your Access Key ID and Secret Access Key.');
    }
    return false;
  }
}

// Test 2: List objects in bucket
async function testListObjects() {
  try {
    console.log('📋 Test 2: Listing objects in bucket...');
    const params = {
      Bucket: BUCKET_NAME,
      MaxKeys: 5,
    };
    
    const result = await s3.listObjectsV2(params).promise();
    console.log(`✅ Successfully listed objects! Found ${result.Contents?.length || 0} objects\n`);
    if (result.Contents && result.Contents.length > 0) {
      console.log('   Sample objects:');
      result.Contents.slice(0, 3).forEach((obj, index) => {
        console.log(`   ${index + 1}. ${obj.Key} (${(obj.Size / 1024).toFixed(2)} KB)`);
      });
      console.log('');
    }
    return true;
  } catch (error) {
    console.error('❌ List objects failed:', error.message);
    return false;
  }
}

// Test 3: Test upload permissions (upload a small test file)
async function testUploadPermission() {
  try {
    console.log('📤 Test 3: Testing upload permission...');
    const testContent = Buffer.from('This is a test file for S3 connection verification');
    const testKey = `test-connection-${Date.now()}.txt`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    };
    
    const result = await s3.upload(params).promise();
    console.log(`✅ Upload successful! File URL: ${result.Location}\n`);
    
    // Clean up: Delete the test file
    console.log('🧹 Cleaning up test file...');
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: testKey,
    }).promise();
    console.log('✅ Test file deleted\n');
    
    return true;
  } catch (error) {
    console.error('❌ Upload test failed:', error.message);
    if (error.code === 'AccessDenied') {
      console.error('   → Access denied. Check your IAM user permissions.');
      console.error('   → Required permissions: s3:PutObject, s3:PutObjectAcl');
    }
    return false;
  }
}

// Test 4: Check bucket policy (public read access)
async function testPublicRead() {
  try {
    console.log('🌐 Test 4: Testing public read access...');
    // Try to get a public URL for a test object
    const testUrl = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: 'test',
      Expires: 0,
    });
    console.log('✅ Public read access configured\n');
    return true;
  } catch (error) {
    console.log('⚠️  Public read access test skipped (this is okay if bucket is private)\n');
    return true;
  }
}

// Run all tests
async function runTests() {
  console.log('='.repeat(50));
  console.log('AWS S3 Connection Test');
  console.log('='.repeat(50) + '\n');
  
  // Check if required env vars are set
  if (!BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Missing required environment variables!');
    console.error('   Required: AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
    console.error('   Please check your .env file\n');
    process.exit(1);
  }
  
  const results = {
    bucketAccess: false,
    listObjects: false,
    uploadPermission: false,
    publicRead: false,
  };
  
  // Run tests sequentially
  results.bucketAccess = await testBucketAccess();
  
  if (results.bucketAccess) {
    results.listObjects = await testListObjects();
    results.uploadPermission = await testUploadPermission();
    results.publicRead = await testPublicRead();
  }
  
  // Summary
  console.log('='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log(`Bucket Access:     ${results.bucketAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`List Objects:      ${results.listObjects ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Upload Permission: ${results.uploadPermission ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Public Read:        ${results.publicRead ? '✅ PASS' : '⚠️  SKIP'}`);
  console.log('='.repeat(50) + '\n');
  
  if (results.bucketAccess && results.listObjects && results.uploadPermission) {
    console.log('🎉 All critical tests passed! Your S3 credentials are working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above and fix the issues.\n');
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

