import { BlobServiceClient } from "@azure/storage-blob";
import { IBlobStorage } from "../../../domain/ports/IBlobStorage";
import config from "../../config/default";

export class AzureBlobStorage implements IBlobStorage {
  private containerClient;

  constructor() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      config.azure.connectionString
    );
    this.containerClient = blobServiceClient.getContainerClient(
      config.azure.containerName
    );
  }

  async upload(fileName: string, fileBuffer: Buffer): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(fileBuffer);
    return blockBlobClient.url;
  }

  async delete(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.deleteIfExists();
  }
}
