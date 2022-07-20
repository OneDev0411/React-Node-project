export default (sequelize, Sequelize) => {
  const DeDealModel = sequelize.define(
    "deal",
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      is_finalized: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
