import PhotoGallery from "../../components/PhotoGallery";
import type { Photo } from "react-photo-album";
import { listFiles, getSignedUrlForDownload } from "@/app/utils/r2";

export const runtime = 'edge';

const PREFIX:string = 'the-newly-weds'
const regex = /^([\w-]+)\/(\d+)\.(\d+)x(\d+)\.(\w+)$/;

export default async function Home() {
    // list r2 bucket files
    const r2List = await listFiles(PREFIX)

    //extract relevant information, generate signed url
    const extracted_r2List = await Promise.all(
      r2List.map(async (item) => {
        const key = item?.Key ?? '';
        const match = key.match(regex); // Assuming 'regex' is defined elsewhere to capture width and height
        const widthStr = match?.[3] ?? null; 
        const heightStr = match?.[4] ?? null;
        const width = widthStr ? Number.parseInt(widthStr, 10) : null; 
        const height = heightStr ? Number.parseInt(heightStr, 10) : null;
  
        return {
          src: await getSignedUrlForDownload(key),
          width: width,
          height: height,
          alt: key,
        } as Photo;
      })
    );

  return (
    <div>
    {/* PhotoGallery */}
    <PhotoGallery photos={extracted_r2List}/>
  </div>
);
}