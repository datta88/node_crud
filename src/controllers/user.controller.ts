import { FastifyReply, FastifyRequest } from "fastify";
import { userInterface } from "../interface/user.interface";
import UserServices from "../services/user.services";
import { redis } from "../db/redis";

export class UserControllers {
  createUser = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const data = req.body as userInterface;
      const result = await UserServices.createUserService(data);

      rep.status(201).send({
        success: true,
        data: result,
        message: "User created successfully ....",
      });
    } catch (error) {
      rep.status(500).send({
        success: false,
        message: "User not created",
        error,
      });
    }
  };

  getAllUsers = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const result = await UserServices.getUsersServices();

      rep.status(200).send({
        success: true,
        message: "All users fetched successfully ✅",
        data: result,
      });
    } catch (error) {
      rep.status(500).send({
        success: false,
        message: "Failed to fetch users ❌",
        error,
      });
    }
  };

  clearRedisCache = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      await redis.flushall(); // ✅ Clear all Redis data
      rep.send({ message: "Redis cache cleared ✅" });
    } catch (error) {
      rep.status(500).send({ message: "❌ Failed to clear Redis", error });
    }
  };

  getOneUser = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    rep: FastifyReply
  ) => {
    try {
      const id = req.params.id;

      const cachedUser = await redis.get(`user:${id}`);
      if (cachedUser) {
        return rep.send({
          success: true,
          fromCache: true,
          data: JSON.parse(cachedUser),
        });
      }

      const user = await UserServices.getOneUserService(id);
      if (!user) {
        return rep
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      await redis.set(`user:${id}`, JSON.stringify(user));

      rep.send({
        success: true,
        fromCache: false,
        data: user,
      });
    } catch (error) {
      rep
        .status(500)
        .send({ success: false, message: "Internal Server Error", error });
    }
  };

  updateOneUser = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    rep: FastifyReply
  ) => {
    try {
      const id = req.params.id as string;
      const data = req.body as userInterface;

      const result = await UserServices.updateOneService(id, data);
      if (!result) {
        return rep
          .status(404)
          .send({ success: false, message: "User not found ..... " });
      }

      await redis.del(`user:${id}`);

      const le = await redis.set(`user:${id}`, JSON.stringify(result));
      console.log(le);

      rep.status(201).send({
        success: true,
        data: result,
        message: "User update successfully ...",
      });
    } catch (error) {
      rep.status(500).send({
        success: false,
        message: "User not updated  ...",
      });
    }
  };

  deleteOneUser = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    rep: FastifyReply
  ) => {
    try {
      const id = req.params.id as string;
      const result = await UserServices.deleteOneService(id);
      if (!result) {
        return rep
          .status(404)
          .send({
            success: false,
            message: "User not found or already deleted.",
          });
      }
      rep.status(200).send({
        success: true,
        data: result,
        message: "User deleted successfully ....",
      });
    } catch (error) {
      rep.status(500).send({
        success: false,
        message: "User not deleted ...",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
}

export default new UserControllers();
