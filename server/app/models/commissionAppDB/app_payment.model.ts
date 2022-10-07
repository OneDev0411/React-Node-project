export default (sequelize, Sequelize) => {
  const AppPaymentModel = sequelize.define(
    "app_payment",
    {
      deal: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      de_payment_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      de_paid_to: {
        type: Sequelize.TEXT,
      },
      de_paid_by: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      de_payment_company: {
        type: Sequelize.TEXT,
      },
      de_payment_company_address: {
        type: Sequelize.TEXT,
      },
      de_payment_office: {
        type: Sequelize.TEXT,
      },
      de_payment_cell: {
        type: Sequelize.TEXT,
      },
      de_payment_fax: {
        type: Sequelize.TEXT,
      },
      de_payment_tax_id: {
        type: Sequelize.TEXT,
      },
      de_payment_mail: {
        type: Sequelize.TEXT,
      },
      payment_side: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AppPaymentModel;
};
