export default (sequelize, Sequelize) => {
  const AppNoteModel = sequelize.define(
    "app_note",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },
      note: {
        type: Sequelize.TEXT,
      }
    },
		{
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
  );

  return AppNoteModel;
};