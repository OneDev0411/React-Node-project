export default (sequelize, Sequelize) => {
  const AppDocStatusModel = sequelize.define(
    "app_doc_status",
    {
      deal: {
        type: Sequelize.UUID,
        AllowNull: false
      },
      referral_doc: {
        type: Sequelize.NUMERIC
      },
      brokerage_form: {
        type: Sequelize.NUMERIC
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return AppDocStatusModel;
}