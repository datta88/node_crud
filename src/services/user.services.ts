// import { userInterface } from "../interface/user.interface";
// import { Users } from "../models/user.model";
// import { redis } from "../db/redis";

// export class UserServices {
//   async createUserService(data: userInterface) {
//     try {
//       const result = await Users.create({
//         name: data.name,
//         title: data.title,
//       });
//       await redis.set(`user:${result.id}`, JSON.stringify(result));

//       return result;
//     } catch (error) {
//       throw new Error("Internal server error .......");
//     }
//   }

//   async getUsersServices() {
//     // const result = await Users.findAll();
//     // return result;
//     const cache = await redis.get("allUsers");
//     if (cache) return JSON.parse(cache);

//     const result = await Users.findAll();
//     await redis.set("allUsers", JSON.stringify(result));
//     return result;
//   }

// }

// export default new UserServices();

import { userInterface } from "../interface/user.interface";
import { Users } from "../models/user.model";
import { redis } from "../db/redis"; // ✅ added
import { title } from "process";

export class UserServices {
  async createUserService(data: userInterface) {
    try {
      const result = await Users.create({
        name: data.name,
        title: data.title,
      });

      await redis.set(`user:${result.id}`, JSON.stringify(result)); // ✅ cache single user

      return result;
    } catch (error) {
      throw new Error("Internal server error .......");
    }
  }

  async getUsersServices() {
    try {
      const cached = await redis.get("allUsers");
      if (cached) {
        return JSON.parse(cached); // ✅ return from cache
      }

      const result = await Users.findAll();

      // 💾 Save to Redis cache
      await redis.set("allUsers", JSON.stringify(result));

      return result;
    } catch (error) {
      throw new Error("Internal server error while fetching users");
    }
  }

  async getOneUserService(id: string) {
    const user = await Users.findByPk(id);
    return user;
  }

  async updateOneService(id: string, data: userInterface) {
    try {
      const userId = await Users.findByPk(id);
      const result = await userId?.update({
        name: data.name,
        title: data.title,
      });
      return result;
    } catch (error) {
      throw new Error("Internal Server Error in update");
    }
  }
}

export default new UserServices();
