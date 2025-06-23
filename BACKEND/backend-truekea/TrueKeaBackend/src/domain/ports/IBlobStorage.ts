export interface IBlobStorage {
  upload(fileName: string, fileBuffer: Buffer): Promise<string>;
  delete(fileName: string): Promise<void>;
}
