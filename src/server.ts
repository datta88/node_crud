

import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import { sequelize } from "./db/postgres"; // ✅ correct Sequelize instance
import { initModels } from "./models/initModels"; // ✅ model initializer
import userRoutes from "./routes/user.routes"; // ✅ your route

// Load .env variables
dotenv.config();

// Create Fastify app
const app = fastify();

// Sample root route
app.get("/", async (req: FastifyRequest, rep: FastifyReply) => {
  rep.send({ message: "Hello World" });
});

// Register routes
app.register(userRoutes, { prefix: "/user" });

// Start server
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    initModels(); // call all static initmodel() functions

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");

    app.listen({ port: Number(process.env.PORT) || 3000 }, (err, address) => {
      if (err) throw err;
      console.log(`🚀 Server listening at ${address}`);
    });
  } catch (error) {
    app.log.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

start();
