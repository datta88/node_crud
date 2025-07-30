import { DataTypes, Model, Sequelize } from "sequelize";

export class Users extends Model {
  declare id: string;
  declare name: string;
  declare title: string;
  declare created_at: Date;
  declare updated_at: Date;

  static initModels(sequelize: Sequelize) {
    Users.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Users",
        tableName: "user-redis",
        timestamps: false, // ✅ manually handle created_at/updated_at
      }
    );
  }
}
