// application/item/UpdateItem.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import { IBlobStorage } from "../../domain/ports/IBlobStorage";
import ItemDTO from "../../domain/dtos/ItemDTO";
import { Item } from "../../domain/entities/Item";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import { AzureBlobStorage } from "../../infrastructure/adapter/azure/AzureBlobStorage";

export default class UpdateItem {
  private repo: IItemRepository;
  private blobStorage: IBlobStorage;

  constructor() {
    this.repo = new ItemRepository();
    this.blobStorage = new AzureBlobStorage();
  }

  async execute(
    data: {
      id: string;
      title: string;
      description: string;
      value: number;
      categoryId: number;
      ownerId: number;
    },
    file?: Express.Multer.File
  ): Promise<Item> {
    try {
      const dto = new ItemDTO(
        data.title,
        data.description,
        data.value,
        data.categoryId,
        data.ownerId
      );

      let imageUrl = "";

      if (file) {
        imageUrl = await this.blobStorage.upload(
          file.originalname,
          file.buffer
        );
      }

      const entity = new Item(
        Number(data.id),
        dto.title,
        dto.description,
        dto.value,
        dto.categoryId,
        dto.ownerId,
        imageUrl
      );

      return await this.repo.update(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
