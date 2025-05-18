import { Photo } from "react-photo-album";
import PhotoGalleryClient from "./PhotoGalleryClient";
import { unstable_noStore } from "next/cache";

export const runtime = 'edge';

interface PhotoGalleryProps {
  photos?: Photo[];
  // Add option to fetch photos dynamically if not provided
  fetchFromPath?: string;
}

export default async function PhotoGallery({ photos, fetchFromPath }: PhotoGalleryProps) {
  // This prevents caching of dynamic data
  unstable_noStore();
  
  let photosToRender: Photo[] = [];
  
  // If photos are directly provided, use them
  if (photos && photos.length > 0) {
    photosToRender = photos;
  } 
  // If fetchFromPath is provided, import that module to get photos
  else if (fetchFromPath) {
    try {
      // Dynamic import on the server
      const photoModule = await import(fetchFromPath);
      photosToRender = photoModule.default || [];
    } catch (error) {
      console.error("Failed to load photos:", error);
    }
  }
  
  // You could also perform additional processing here if needed
  // For example, add blurDataURL for each image by generating it on the server

  // Pass the processed photos to the client component
  return <PhotoGalleryClient photosrc={photosToRender} />;
}