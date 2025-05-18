export const encodeBase64 = (data: string): string => {
    return Buffer.from(data).toString('base64');
}

export const decodeBase64 = (base64String: string): Buffer => {
    return Buffer.from(base64String, 'base64');
}