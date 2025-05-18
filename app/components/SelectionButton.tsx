"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent, useRef } from "react";

const UPLOAD_API_PATH = '/api/upload'
const REDIRECT_EVENT = '/gallery/event'
const REDIRECT_NEWLY_WEDS = '/gallery/the-newly-weds'

const PhotoUploadButton: React.FC = () => {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleClick = (action: string) => {
    if (action === "new") {
      setShowButtons(prevState => !prevState); // Toggle visibility
    }
  };

  const handleNav = (navItem: string) => {
    router.push(navItem);
  }

  // Type definition for fileInputRef
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Programmatically click the hidden file input
  const handleFileUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    // logic for after file selection
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64image = reader.result as string;
      const payload = {image: base64image}
      try{
        const response = await fetch(UPLOAD_API_PATH,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        window.location.href = REDIRECT_EVENT;
      } catch(err){
        console.error('Error Uploading File',err)
      }
    }
    reader.onerror = (err) =>{
      console.error(err);
      alert('There was an error with the upload');
    }
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed z-1001 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        <div className="flex items-center justify-center">
          {/*start of create new button*/}
          <button
            onClick={() => handleClick("new")}
            data-tooltip-target="tooltip-new"
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
            <span className="sr-only">New item</span>
          </button>
        </div>
        {/* Start of Upload and Take Photo Button */}
        {showButtons && (
          <div className="absolute bottom-full mb-2 left-[12%] md:left-[12.75%]">
            <div className="flex flex-col space-y-2">
              {/*Take Photo Button */}{/*
              <button
                onClick={() => handleTakePhoto()}
                className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 13H9" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M12 10L12 16" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
                  <path opacity="1.0" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" stroke="#FFFFFF" stroke-width="1.5" />
                  <path d="M19 10H18" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
              */}{/* Upload Photo Button */}
              <button
                onClick={handleFileUploadClick}
                className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                    <path opacity="1.0" fill-rule="evenodd" clip-rule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#FFFFFF"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.25C12.2106 2.25 12.4114 2.33852 12.5535 2.49392L16.5535 6.86892C16.833 7.17462 16.8118 7.64902 16.5061 7.92852C16.2004 8.20802 15.726 8.18678 15.4465 7.88108L12.75 4.9318V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V4.9318L8.55353 7.88108C8.27403 8.18678 7.79963 8.20802 7.49393 7.92852C7.18823 7.64902 7.16698 7.17462 7.44648 6.86892L11.4465 2.49392C11.5886 2.33852 11.7894 2.25 12 2.25Z" fill="#FFFFFF"></path> </g>
                </svg>
              </button>
              {/* hidden input field for upload button*/}
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" multiple={ false } />
            </div>
          </div>
        )}
        {/* end of Upload and Take Photo Button */}
        {/*end of create new button*/}
        {/*start of Event button*/}
        <button
          onClick={() => handleNav("/gallery/event")}
          data-tooltip-target="tooltip-home"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg width="35px" height="35px" viewBox="0 0 24 24" id="meteor-icon-kit__regular-party-horn" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1214_4416)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13 11C14.9509 11 16.2542 10.3277 17.1047 9.19375C17.8601 8.18654 18.1833 6.89179 18.4476 5.83292L18.4701 5.74254C18.7639 4.5674 19.0067 3.65769 19.4953 3.00625C19.9105 2.45271 20.5759 2 22 2C22.5523 2 23 1.55228 23 1C23 0.447715 22.5523 0 22 0C20.0491 0 18.7458 0.672288 17.8953 1.80625C17.1399 2.81346 16.8167 4.10821 16.5524 5.16708L16.5299 5.25746C16.2361 6.4326 15.9933 7.34231 15.5047 7.99375C15.0895 8.54729 14.4241 9 13 9C12.4477 9 12 9.44771 12 10C12 10.5523 12.4477 11 13 11ZM8.20161 0.400757C8.53314 -0.0409558 9.15997 -0.130281 9.60168 0.201244C10.2319 0.674222 10.7627 1.26669 11.1639 1.94483C11.5651 2.62296 11.8288 3.37348 11.94 4.15353C12.0512 4.93358 12.0076 5.72789 11.8118 6.4911C11.616 7.25431 11.2717 7.97148 10.7988 8.60166C10.4672 9.04338 9.8404 9.1327 9.39868 8.80118C8.95697 8.46965 8.86765 7.84282 9.19917 7.4011C9.51449 6.98098 9.74397 6.50287 9.87452 5.99406C10.0051 5.48526 10.0341 4.95572 9.96 4.43568C9.8859 3.91565 9.71009 3.4153 9.44262 2.96321C9.17514 2.51113 8.82124 2.11615 8.40112 1.80083C7.95941 1.4693 7.87009 0.842469 8.20161 0.400757ZM6 6C6.55228 6 7 5.55228 7 5C7 4.44772 6.55228 4 6 4C5.44772 4 5 4.44772 5 5C5 5.55228 5.44772 6 6 6ZM5.79244 9.0218C6.12357 8.95153 6.46777 9.05355 6.70714 9.29291L14.7071 17.2929C14.9465 17.5323 15.0485 17.8765 14.9782 18.2076C14.908 18.5387 14.675 18.8118 14.359 18.9334L1.35901 23.9334C0.99016 24.0752 0.572363 23.9866 0.292922 23.7071C0.0134815 23.4277 -0.0751812 23.0099 0.0666833 22.641L5.06668 9.64104C5.1882 9.32509 5.4613 9.09207 5.79244 9.0218ZM6.38099 11.7952L5.22218 14.8081L9.19195 18.7779L12.2049 17.6191L6.38099 11.7952ZM2.74108 21.259L4.43651 16.8508L7.1492 19.5635L2.74108 21.259ZM19 19C19.5523 19 20 18.5523 20 18C20 17.4477 19.5523 17 19 17C18.4477 17 18 17.4477 18 18C18 18.5523 18.4477 19 19 19ZM18.0079 14.125C18.5168 13.9947 19.0464 13.9659 19.5663 14.0403C20.0863 14.1147 20.5866 14.2907 21.0386 14.5584C21.4905 14.8261 21.8853 15.1802 22.2004 15.6005C22.5317 16.0424 23.1585 16.1321 23.6004 15.8008C24.0423 15.4695 24.1319 14.8427 23.8006 14.4008C23.3279 13.7704 22.7358 13.2392 22.0578 12.8377C21.3799 12.4361 20.6295 12.172 19.8495 12.0604C19.0695 11.9489 18.2752 11.992 17.5119 12.1875C16.7486 12.3829 16.0312 12.7268 15.4008 13.1994C14.9589 13.5307 14.8693 14.1575 15.2006 14.5994C15.5319 15.0413 16.1587 15.1309 16.6005 14.7996C17.0208 14.4845 17.4991 14.2553 18.0079 14.125Z" fill="#758CA3" />
            </g>
            <defs>
              <clipPath id="clip0_1214_4416">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="sr-only">Home</span>
        </button>

        <div
          id="tooltip-home"
          role="tooltip"
          className="absolute z-1010 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
        >
          Home
          <div className="tooltip-arrow" data-popper-arrow />
        </div>
        {/*end of Event button*/}
        {/*start of The-Newly-Weds button*/}
        <button
          onClick={() => handleNav("/gallery/the-newly-weds")}
          data-tooltip-target="tooltip-profile"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg width="38px" height="38px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
            <g id="SVGRepo_iconCarrier"><g id="colored" stroke-width="5.0" fill="none" fill-rule="evenodd"> <g id="Holidays_sliced"> </g> <g id="Holidays" transform="translate(5.000000, 3.000000)" stroke="#758CA3" stroke-width="2.94" stroke-linecap="round" stroke-linejoin="round"> <g id="Wedding" transform="translate(0.000000, 4.000000)"> <path d="M18.1327868,0.932322573 C15.5547756,1.92192834 14.5880122,5.65000968 15.9734603,9.25922531 C17.3573726,12.8644401 23,15.5000002 23,15.5000002 C23,15.5000002 28.9253523,12.8644401 30.3092646,9.25922531 C31.6947127,5.65000968 30.7279493,1.92192834 28.1499381,0.932322573 C26.5272972,0.30944908 24.653089,0.919921664 23.1413624,2.35789076 C23.1413624,2.35789076 19.7554277,0.30944908 18.1327868,0.932322573 Z" id="Oval-1690" fill="#E65F58"> </path>
              <path d="M26.9244035,46.8154782 C29.294794,48.2040416 32.054444,49 35,49 C43.836556,49 51,41.836556 51,33 C51,24.163444 43.836556,17 35,17 C26.163444,17 19,24.163444 19,33 C19,36.2290072 19.9565195,39.2346073 21.6016685,41.7489103" id="Oval-1690"> </path> <path d="M20.1652501,20.1484669 C18.4248387,19.409055 16.5101893,19 14.5,19 C6.49187113,19 0,25.4918711 0,33.5 C0,41.5081289 6.49187113,48 14.5,48 C22.5081289,48 29,41.5081289 29,33.5 C29,30.1794472 27.8838346,27.1195888 26.0062229,24.675144" id="Oval-1690"> </path> </g> </g> </g> </g>
          </svg>
          <span className="sr-only">Profile</span>
        </button>
        <div
          id="tooltip-profile"
          role="tooltip"
          className="absolute invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
        >
          The-Newly-Weds
          <div className="tooltip-arrow" data-popper-arrow />
        </div>
        {/*end of The-Newly-Weds button*/}
      </div>
    </div>
  );
};

export default PhotoUploadButton;
