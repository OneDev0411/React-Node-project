/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

export default (sequelize, Sequelize) => {
	const GCI2DE = sequelize.define('GCI2DEs', {
		dealID: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		roleId: {
			type: Sequelize.STRING,
		},
		share: {
			type: Sequelize.INTEGER,
		},
		note: {
			type: Sequelize.STRING
		}		

	});

	return GCI2DE;
}