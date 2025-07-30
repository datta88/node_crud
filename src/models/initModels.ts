import { sequelize } from "../db/postgres";
import { Users } from "./user.model";

export function initModels(){
    Users.initModels(sequelize)
}