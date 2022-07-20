export default (sequelize, Sequelize) => {
  const ContactModel = sequelize.define("contact", {
    id: {
      type: Sequelize.INTEGER,
    },
    contact: {
      type: Sequelize.UUID,
    },
    object: {
      type: Sequelize.JSONB,
    },
  });
  return ContactModel;
};
