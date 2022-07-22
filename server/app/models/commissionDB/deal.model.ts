export default (sequelize, Sequelize) => {
  const DealModel = sequelize.define(
    "deal",
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
