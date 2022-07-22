export default (sequelize, Sequelize) => {
  const DealModel = sequelize.define(
    "deal",
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
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
      object: {
        type: Sequelize.JSONB,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DealModel;
};
