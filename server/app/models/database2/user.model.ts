export default (sequelize, Sequelize) => {
  const UserModel = sequelize.define("user", {
    key: {
      type: Sequelize.TEXT,
    },
    user: {
      type: Sequelize.UUID,
    },
    object: {
      type: Sequelize.JSONB,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  });
  return UserModel;
};
