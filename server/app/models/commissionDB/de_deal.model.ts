export default (sequelize, Sequelize) => {
  const DeDealModel = sequelize.define(
    "de_deal",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
      },
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      is_finalized: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DeDealModel;
};
