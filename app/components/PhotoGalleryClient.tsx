"use client";

import Image from "next/image";
import type { Photo } from "react-photo-album";
import { RenderImageContext, RenderImageProps, ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { useState } from "react";

interface PhotoGalleryClientProps {
  photosrc: Photo[];
}

function renderNextImage({ alt = "", title, sizes }: RenderImageProps, { photo, width, height }: RenderImageContext) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder="empty"
        priority={false}
      />
    </div>
  );
}

export default function PhotoGalleryClient({ photosrc }: PhotoGalleryClientProps) {
  const [index, setIndex] = useState(-1);
  
  const handleClick = (index: number) => {
    setIndex(index);
  };
  
  return (
    <>
      <ColumnsPhotoAlbum
        photos={photosrc}
        render={{ image: renderNextImage }}
        defaultContainerWidth={1200}
        sizes={{
          size: "1168px",
          sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
        }}
        onClick={({ index }) => handleClick(index)}
      />
      
      <Lightbox
        slides={photosrc}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download]}
      />
    </>
  );
}