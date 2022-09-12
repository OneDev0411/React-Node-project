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
      inside_de_payment_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      inside_de_paid_to: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      outside_de_paid_to: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_company: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_company_address: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_office: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_cell: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_fax: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_tax_id: {
        type: Sequelize.TEXT,
      },
      outside_de_payment_mail: {
        type: Sequelize.TEXT,
      },
      approval_request_date: {
        type: Sequelize.TEXT,
      },
      submitted: {
        type: Sequelize.NUMERIC,
      },
      current_step: {
        type: Sequelize.NUMERIC,
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AppDealModel;
};
