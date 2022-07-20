export default (sequelize, Sequelize) => {
  const OfficeModel = sequelize.define("office", {
    brand: {
      type: Sequelize.UUID,
    },
    admin_role: {
      type: Sequelize.UUID,
    },
    business_locations: {
      type: Sequelize.TEXT,
    },
  });
  return OfficeModel;
};
