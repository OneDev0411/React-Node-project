export default (sequelize, Sequelize) => {
  const AppTransCoordinatorModel = sequelize.define(
    "app_trans_coordinator",
    {
      deal: {
        type: Sequelize.UUID,
        AllowNull: false
      },
      trans_coordinator: {
        type: Sequelize.NUMERIC
      },
      email_address: {
        type: Sequelize.NUMERIC
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  return AppTransCoordinatorModel
}