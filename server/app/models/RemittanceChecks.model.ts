/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

export default (sequelize, Sequelize) => {
	const RemittanceChecks = sequelize.define('remittance_check', {
		deal_id: {
			type: Sequelize.TEXT,
		},
        check_num: {
            type: Sequelize.NUMBER
        },
        check_date: {
            type: Sequelize.DATE
        },
        check_receive_date: {
            type: Sequelize.DATE
        },
        amount: {
            type: Sequelize.NUMBER
        }
	});

	return RemittanceChecks;
}