import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
  } from '@aws-sdk/client-s3'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface FileObject {
  Key?: string
  LastModified?: Date
  ETag?: string
  Size?: number
  StorageClass?: string
}

const R2_URL = process.env.R2_API_ENDPOINT as string
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY as string
const R2_SECRET_KEY = process.env.R2_SECRET_KEY as string
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME as string

function getS3Client(): S3Client {
    try{
      const s3 = new S3Client({
        region: "auto",
        endpoint: R2_URL,
        credentials: {
          accessKeyId: R2_ACCESS_KEY,
          secretAccessKey: R2_SECRET_KEY,
        }
      })
      return s3
    } catch(error){
      throw error
    }
  }

export async function uploadFile(file: Buffer, key: string){
  const s3 = getS3Client()

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
  })
  
  try{
    const response = await s3.send(command)
    return response
  } catch(error){
    throw error
  }
}

// ListObjectsV2Command to list all files
export async function listFiles(prefix: string = ''): Promise<FileObject[]> {
  const s3 = getS3Client()
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix
  })

  try {
    const response = await s3.send(command)
    return response.Contents || []
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}


// GetObjectCommand to getFile
export async function getSignedUrlForDownload(key: string): Promise<string> {
  const s3 = getS3Client()
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key
  })

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }
}