/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

module.exports = (sequelize, Sequelize) => {
	const Test = sequelize.define('test', {
		column1: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		column2: {
			type: Sequelize.STRING,
		},
		column3: {
			type: Sequelize.INTEGER,
		},
	});

	return Test;
}