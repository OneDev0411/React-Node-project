export default (sequelize, Sequelize) => {
  const ContactModel = sequelize.define("contact", {
    contact: {
      type: Sequelize.UUID,
    },
    object: {
      type: Sequelize.JSONB,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return ContactModel;
};
