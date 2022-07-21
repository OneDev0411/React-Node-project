export default (sequelize, Sequelize) => {
  const AgentsOfficeModel = sequelize.define(
    "agents_office",
    {
      key: {
        type: Sequelize.TEXT,
      },
      office: {
        type: Sequelize.INTEGER,
      },
      user: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      brand: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      agent_role: {
        type: Sequelize.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return AgentsOfficeModel;
};
