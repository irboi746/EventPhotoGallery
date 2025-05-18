import { decryptJWT } from '@/app/utils/jwtEncryption';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const SECRET = process.env.SECRET;
const ENCKEY = process.env.ENCKEY;
const EVENT_ID = process.env.EVENT_ID;

export const checkAuthentication = async (authCookie: RequestCookie): Promise<boolean> => {
    if (authCookie.value && SECRET && ENCKEY){
        const decryptedJWT = await decryptJWT(authCookie.value, SECRET, ENCKEY);
        const event_id = decryptedJWT?.event_id;
        const permitted = decryptedJWT?.permitted;

        // Check if the the JWT contains the correct value
        const isAuthenticated = event_id === EVENT_ID && permitted === true;
        if (isAuthenticated){
            return true;
        }
    }
    return false;
}

export const checkUploadPermission = async (authCookie: RequestCookie) : Promise<boolean> => {
    if (authCookie?.value && SECRET && ENCKEY){
        const decryptedJWT = await decryptJWT(authCookie.value, SECRET, ENCKEY);
        const upload_permitted = decryptedJWT?.upload_permitted;

        // Check if the the JWT contains the correct value
        if(upload_permitted === true){
            return true;
        }
    }
    return false;
}