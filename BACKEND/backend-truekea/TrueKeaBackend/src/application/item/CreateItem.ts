// application/item/CreateItem.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import { IBlobStorage } from "../../domain/ports/IBlobStorage";
import ItemDTO from "../../domain/dtos/ItemDTO";
import { Item } from "../../domain/entities/Item";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import { AzureBlobStorage } from "../../infrastructure/adapter/azure/AzureBlobStorage";

export default class CreateItem {
  private repo: IItemRepository;
  private blobStorage: IBlobStorage;

  constructor() {
    this.repo = new ItemRepository();
    this.blobStorage = new AzureBlobStorage();
  }

  async execute(dto: ItemDTO, file: Express.Multer.File): Promise<Item> {
    try {
      const fileUrl = await this.blobStorage.upload(
        file.originalname,
        file.buffer
      );

      const entity = new Item(
        0,
        dto.title,
        dto.description,
        Number(dto.value),
        Number(dto.categoryId),
        Number(dto.ownerId),
        fileUrl
      );
      console.log(entity);

      return await this.repo.create(entity);
    } catch (err: any) {
      console.error("Error creating item:", err);
      throw new Error(err.message || "Error creating item");
    }
  }
}
