
export function jsonToBuffer(json: Record<string, any>): Buffer {
    return Buffer.from(JSON.stringify(json));
}

export function bufferToJson(buffer: Buffer): Record<string, any> {
    return JSON.parse(buffer.toString());
}

export function base64ToJson(base64: string): Record<string, any> {
    return bufferToJson(Buffer.from(base64, 'base64'));
}

export function jsonToBase64(json: Record<string, any>): string {
    return jsonToBuffer(json).toString('base64');
}
