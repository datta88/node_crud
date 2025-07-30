import { sequelize } from "./db/postgres";
import { Users } from "./models/user.model";

Users.initModels(sequelize);

sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Synced DB");
});
