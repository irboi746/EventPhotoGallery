import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { imageSize } from 'image-size'
import { uploadFile } from '@/app/utils/r2';
import { checkImageSchema, checkIsImage } from '@/app/utils/imageValidation'
import { checkUploadPermission } from '@/app/utils/auth'

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('x-custom-auth');
  try{
    if(authCookie){
      const uploadPermission = await checkUploadPermission(authCookie) 
      if (!uploadPermission){
            return NextResponse.json({
              Upload_Status: 'No Permission',
            });
      }
    }
  } catch(err){
    console.log(err);
  }

  try{
    // Image Validation
    const validatedImageJson = checkImageSchema(body)
    const fileExtension = await checkIsImage(validatedImageJson.image)

    // Prepare Image for Upload 
    const base64Image = validatedImageJson.image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const dimensions = imageSize(imageBuffer)
    const date = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Singapore',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const currentTime = date.replace(/[/, :]/g, '');
    const key = `event/${currentTime}.${dimensions.width}x${dimensions.height}.${fileExtension}`

    // Upload file
    const uploadResult = await uploadFile(imageBuffer, key);
    if(uploadResult){
      return NextResponse.json({
        Upload_Status: 'OK',
        Key: key
      });
    }
  } catch(err) {
    return NextResponse.json({
      Upload_Status: err,
    });
  }
}

