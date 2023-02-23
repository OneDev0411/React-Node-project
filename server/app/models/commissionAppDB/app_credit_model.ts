export default (sequelize, Sequelize) => {
  const AppCreditModel  = sequelize.define(
    "app_credit",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      credit_side: {
        type: Sequelize.TEXT,
      },
      credit_to: {
        type: Sequelize.TEXT
      },
      credit_amount: {
        type: Sequelize.TEXT
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AppCreditModel;
};
