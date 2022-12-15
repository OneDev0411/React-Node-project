export default (sequelize, Sequelize) => {
	const AppFeeModel = sequelize.define(
		"app_fee",
		{
			deal: {
				type: Sequelize.UUID,
				AllowNull: false
			},
			deal_side: {
				type: Sequelize.NUMERIC
			},
			fee_type: {
				type: Sequelize.TEXT
			},
			fee_amount: {
				type: Sequelize.TEXT
			},
			fee_amount_percentage: {
				type: Sequelize.TEXT
			},
			fee_unit: {
				type: Sequelize.NUMERIC,
			},
			fee_method: {
				type: Sequelize.NUMERIC
			},
			key_Index: {
				type: Sequelize.NUMERIC
			}
		},
		{
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	);

	return AppFeeModel;
}