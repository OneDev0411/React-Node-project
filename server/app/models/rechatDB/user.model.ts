export default (sequelize, Sequelize) => {
  const UserModel = sequelize.define(
    "user",
    {
      key: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user: {
        type: Sequelize.UUID,
      },
      object: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserModel;
};
