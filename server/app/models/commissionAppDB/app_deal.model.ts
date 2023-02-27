export default (sequelize, Sequelize) => {
  const AppDealModel = sequelize.define(
    "app_deal",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      gci_de_value: {
        type: Sequelize.NUMERIC,
        allowNull: false,
      },
      gci_reason_select: {
        type: Sequelize.INTEGER,
      },
      gci_reason: {
        type: Sequelize.TEXT,
      },
      brokerage_commission: {
        type: Sequelize.NUMERIC,
      },
      stage_cost: {
        type: Sequelize.NUMERIC,
      },
      remittance_buy_side_bank_wire_amount: {
        type: Sequelize.NUMERIC,
      },
      remittance_listing_side_bank_wire_amount: {
        type: Sequelize.NUMERIC,
      },
      approval_request_date: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TEXT,
      },
      submitted: {
        type: Sequelize.NUMERIC,
      },
      current_step: {
        type: Sequelize.NUMERIC,
      },
      deal_status: {
        type: Sequelize.TEXT
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

  return AppDealModel;
};
