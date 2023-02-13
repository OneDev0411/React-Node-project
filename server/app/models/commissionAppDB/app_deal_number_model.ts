export default (sequelize, Sequelize) => {
  const AppDealNumberModel = sequelize.define(
    "app_deal_number",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },
      deal_number: {
        type: Sequelize.TEXT,
      }
    },
		{
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
  );

  return AppDealNumberModel;
};