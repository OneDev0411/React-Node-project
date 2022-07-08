/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
export default (sequelize, Sequelize) => {
	const RoleData = sequelize.define('role_data', {
		deal_id: {
            type: Sequelize.TEXT
        },
        role_id: {
            type: Sequelize.TEXT
        },
        legal_full_name: {
            type: Sequelize.TEXT
        },
        role: {
            type: Sequelize.TEXT
        },
        share_percent: {
            type: Sequelize.NUMBER
        },
        share_value: {
            type: Sequelize.NUMBER
        },
        note: {
            type: Sequelize.TEXT
        },
        payment_unit_type: {
            type: Sequelize.INTEGER
        },
        payment_value: {
            type: Sequelize.INTEGER
        }
	});

	return RoleData;
}