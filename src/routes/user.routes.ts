import { FastifyInstance } from "fastify";
import UserControllers from "../controllers/user.controller";
import userController from "../controllers/user.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/create", UserControllers.createUser);
  fastify.get("/clear-cache", UserControllers.clearRedisCache); 
  fastify.get("/all", UserControllers.getAllUsers);
  fastify.get("/get/:id", UserControllers.getOneUser);
  fastify.put("/update/:id", userController.updateOneUser);
  fastify.delete("/delete/:id", userController.deleteOneUser);
}
