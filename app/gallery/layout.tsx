import React from "react";
import PhotoUploadButton from "../components/SelectionButton"

export default function galleryLayout({children}: {children: React.ReactNode}){
    return (
        <div>
            <div className="flex-1 overflow-y-auto h-[calc(100vh-7rem)]">
                {children}
            </div>
            
            {/* PhotoUploadButton at the bottom center */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-20">
                <PhotoUploadButton />
            </div>
        </div>
    )
}