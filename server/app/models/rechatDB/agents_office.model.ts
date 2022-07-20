export default (sequelize, Sequelize) => {
  const AgentsOfficeModel = sequelize.define("agents_office", {
    key: {
      type: Sequelize.TEXT,
    },
    office: {
      type: Sequelize.INTEGER,
    },
    user: {
      type: Sequelize.UUID,
    },
    brand: {
      type: Sequelize.UUID,
    },
    agent_role: {
      type: Sequelize.UUID,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return AgentsOfficeModel;
};
