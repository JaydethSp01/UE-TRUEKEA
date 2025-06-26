// infrastructure/web/controllers/NotificationsController.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { SwapEntity } from "../../adapter/typeorm/entities/SwapEntity";
import { MessageEntity } from "../../adapter/typeorm/entities/MessageEntity";
import { UserEntity } from "../../adapter/typeorm/entities/UserEntity";

const NotificationsController = {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "userId inválido" });
      }

      // Inicializar respuesta por defecto
      const defaultResponse = {
        swaps: [],
        messages: [],
        counts: {
          totalSwaps: 0,
          pendingSwaps: 0,
          totalMessages: 0,
          unreadMessages: 0,
        },
      };

      // Verificar que el usuario existe
      try {
        const userRepo = getRepository(UserEntity);
        const userExists = await userRepo.findOne({ where: { id: userId } });

        if (!userExists) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
      } catch (userError) {
        console.error("Error verificando usuario:", userError);
        return res.json(defaultResponse);
      }

      // Arrays para almacenar resultados
      const validSwaps: any[] = [];
      const validMessages: any[] = [];

      // Obtener swaps de forma segura
      try {
        const swapRepo = getRepository(SwapEntity);

        // Primera consulta: swaps donde el usuario es requester
        try {
          const requesterSwaps = await swapRepo
            .createQueryBuilder("swap")
            .leftJoinAndSelect("swap.requester", "requester")
            .leftJoinAndSelect("swap.respondent", "respondent")
            .leftJoinAndSelect("swap.requestedItem", "requestedItem")
            .leftJoinAndSelect("swap.offeredItem", "offeredItem")
            .where("swap.requesterId = :userId", { userId })
            .limit(25)
            .getMany();

          requesterSwaps.forEach((swap) => {
            try {
              // Solo agregar si tiene las relaciones mínimas necesarias
              if (swap && swap.id) {
                validSwaps.push({
                  id: swap.id,
                  requester: swap.requester
                    ? {
                        id: swap.requester.id || userId,
                        name: swap.requester.name || "Usuario",
                        email: swap.requester.email || "",
                      }
                    : {
                        id: userId,
                        name: "Usuario",
                        email: "",
                      },
                  respondent: swap.respondent
                    ? {
                        id: swap.respondent.id || 0,
                        name: swap.respondent.name || "Usuario",
                        email: swap.respondent.email || "",
                      }
                    : {
                        id: 0,
                        name: "Usuario eliminado",
                        email: "",
                      },
                  requestedItem: swap.requestedItem
                    ? {
                        id: swap.requestedItem.id || 0,
                        title:
                          swap.requestedItem.title || "Producto no disponible",
                        img_item: swap.requestedItem.img_item || null,
                        category: "Sin categoría",
                      }
                    : {
                        id: 0,
                        title: "Producto eliminado",
                        img_item: null,
                        category: "Sin categoría",
                      },
                  offeredItem: swap.offeredItem
                    ? {
                        id: swap.offeredItem.id || 0,
                        title:
                          swap.offeredItem.title || "Producto no disponible",
                        img_item: swap.offeredItem.img_item || null,
                        category: "Sin categoría",
                      }
                    : {
                        id: 0,
                        title: "Producto eliminado",
                        img_item: null,
                        category: "Sin categoría",
                      },
                  status: swap.status || "unknown",
                  createdAt: swap.createdAt || new Date(),
                  updatedAt: swap.updatedAt || new Date(),
                });
              }
            } catch (swapProcessError) {
              console.error(
                "Error procesando swap individual:",
                swapProcessError
              );
            }
          });
        } catch (requesterError) {
          console.error(
            "Error obteniendo swaps como requester:",
            requesterError
          );
        }

        // Segunda consulta: swaps donde el usuario es respondent
        try {
          const respondentSwaps = await swapRepo
            .createQueryBuilder("swap")
            .leftJoinAndSelect("swap.requester", "requester")
            .leftJoinAndSelect("swap.respondent", "respondent")
            .leftJoinAndSelect("swap.requestedItem", "requestedItem")
            .leftJoinAndSelect("swap.offeredItem", "offeredItem")
            .where("swap.respondentId = :userId", { userId })
            .limit(25)
            .getMany();

          respondentSwaps.forEach((swap) => {
            try {
              if (
                swap &&
                swap.id &&
                !validSwaps.find((s) => s.id === swap.id)
              ) {
                validSwaps.push({
                  id: swap.id,
                  requester: swap.requester
                    ? {
                        id: swap.requester.id || 0,
                        name: swap.requester.name || "Usuario",
                        email: swap.requester.email || "",
                      }
                    : {
                        id: 0,
                        name: "Usuario eliminado",
                        email: "",
                      },
                  respondent: swap.respondent
                    ? {
                        id: swap.respondent.id || userId,
                        name: swap.respondent.name || "Usuario",
                        email: swap.respondent.email || "",
                      }
                    : {
                        id: userId,
                        name: "Usuario",
                        email: "",
                      },
                  requestedItem: swap.requestedItem
                    ? {
                        id: swap.requestedItem.id || 0,
                        title:
                          swap.requestedItem.title || "Producto no disponible",
                        img_item: swap.requestedItem.img_item || null,
                        category: "Sin categoría",
                      }
                    : {
                        id: 0,
                        title: "Producto eliminado",
                        img_item: null,
                        category: "Sin categoría",
                      },
                  offeredItem: swap.offeredItem
                    ? {
                        id: swap.offeredItem.id || 0,
                        title:
                          swap.offeredItem.title || "Producto no disponible",
                        img_item: swap.offeredItem.img_item || null,
                        category: "Sin categoría",
                      }
                    : {
                        id: 0,
                        title: "Producto eliminado",
                        img_item: null,
                        category: "Sin categoría",
                      },
                  status: swap.status || "unknown",
                  createdAt: swap.createdAt || new Date(),
                  updatedAt: swap.updatedAt || new Date(),
                });
              }
            } catch (swapProcessError) {
              console.error(
                "Error procesando swap individual:",
                swapProcessError
              );
            }
          });
        } catch (respondentError) {
          console.error(
            "Error obteniendo swaps como respondent:",
            respondentError
          );
        }
      } catch (swapError) {
        console.error("Error general obteniendo swaps:", swapError);
      }

      // Obtener mensajes de forma segura
      try {
        const messageRepo = getRepository(MessageEntity);
        const messages = await messageRepo
          .createQueryBuilder("message")
          .leftJoinAndSelect("message.sender", "sender")
          .leftJoinAndSelect("message.receiver", "receiver")
          .leftJoinAndSelect("message.item", "item")
          .where("message.receiverId = :userId", { userId })
          .orderBy("message.createdAt", "DESC")
          .limit(50)
          .getMany();

        messages.forEach((message) => {
          try {
            if (message && message.id) {
              validMessages.push({
                id: message.id,
                sender: message.sender
                  ? {
                      id: message.sender.id || 0,
                      name: message.sender.name || "Usuario",
                    }
                  : {
                      id: 0,
                      name: "Usuario eliminado",
                    },
                receiver: message.receiver
                  ? {
                      id: message.receiver.id || userId,
                      name: message.receiver.name || "Usuario",
                    }
                  : {
                      id: userId,
                      name: "Usuario",
                    },
                item: message.item
                  ? {
                      id: message.item.id || 0,
                      title: message.item.title || "Producto no disponible",
                    }
                  : {
                      id: 0,
                      title: "Producto eliminado",
                    },
                content: message.content || "",
                createdAt: message.createdAt || new Date(),
              });
            }
          } catch (messageProcessError) {
            console.error(
              "Error procesando mensaje individual:",
              messageProcessError
            );
          }
        });
      } catch (messageError) {
        console.error("Error obteniendo mensajes:", messageError);
      }

      // Ordenar por fecha más reciente
      validSwaps.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return res.json({
        swaps: validSwaps,
        messages: validMessages,
        counts: {
          totalSwaps: validSwaps.length,
          pendingSwaps: validSwaps.filter((s) => s.status === "pending").length,
          totalMessages: validMessages.length,
          unreadMessages: 0,
        },
      });
    } catch (error: any) {
      console.error("Error general en getUserNotifications:", error);

      // Siempre retornar una respuesta válida
      return res.json({
        swaps: [],
        messages: [],
        counts: {
          totalSwaps: 0,
          pendingSwaps: 0,
          totalMessages: 0,
          unreadMessages: 0,
        },
      });
    }
  },
};

export default NotificationsController;
