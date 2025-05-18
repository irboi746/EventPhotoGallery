import { z } from 'zod'
import { decodeBase64 } from './base64'
import {fileTypeFromBuffer} from 'file-type';

const imageSchema = z.object(
    {image: z.string()}
)

export const checkImageSchema = (data: unknown) => {
    return imageSchema.parse(data)
  }

const isImage = async (buffer: Buffer): Promise<string | undefined> => {
  const fileType = await fileTypeFromBuffer(buffer)
  const fileExtension = fileType?.ext
  return fileExtension
}

export const checkIsImage = async (base64withPrefix: string) : Promise<string | undefined> => {
    const base64 = base64withPrefix.replace(/^data:.*?;base64,/, '');
    const buffer = decodeBase64(base64)
    const fileExtension = await isImage(buffer)
    if (!fileExtension){
      throw new Error('Invalid Data Type')      
    }
    return fileExtension
  }
