/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
export default (sequelize, Sequelize) => {
  const RolesModel = sequelize.define("Roles", {
    title: {
      type: Sequelize.STRING,
    },
    deal_type: {
      type: Sequelize.STRING,
    },
    checklists: {
      type: Sequelize.STRING,
    },
    tasks: {
      type: Sequelize.STRING,
    },
    roles: {
      type: Sequelize.STRING,
    },
    listing: {
      type: Sequelize.STRING,
    },
    listing_info: {
      type: Sequelize.STRING,
    },
    files: {
      type: Sequelize.STRING,
    },
    inboxes: {
      type: Sequelize.STRING,
    },
    attention_requests: {
      type: Sequelize.INTEGER,
    },
    attention_requested_at: {
      type: Sequelize.INTEGER,
    },
    has_active_offer: {
      type: Sequelize.BOOLEAN,
    },
    is_draft: {
      type: Sequelize.BOOLEAN,
    },
    email: {
      type: Sequelize.STRING,
    },
    created_by: {
      type: Sequelize.I,
    },
    brand: {
      type: Sequelize.STRING,
    },
    property_type: {
      type: Sequelize.STRING,
    },
    faired_at: {
      type: Sequelize.INTEGER,
    },
    context: {
      type: Sequelize.STRING,
    },
    new_notifications: {
      type: Sequelize.STRING,
    },
  });
  return RolesModel;
};
