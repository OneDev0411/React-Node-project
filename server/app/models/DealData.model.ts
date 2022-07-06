/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

export default (sequelize, Sequelize) => {
	const DealData = sequelize.define('deal_data', {
		deal_id: {
			type: Sequelize.TEXT,
		},
		GCI_calculate_type: {
            type: Sequelize.INTEGER,
        },		
        GCI_DE: {
            type: Sequelize.INTEGER
        },
        GCI_reason: {
            type: Sequelize.TEXT
        },
        stage_cost: {
            type: Sequelize.NUMBER
        },
        remittance_bank_wire_amount: {
            type: Sequelize.NUMBER
        },
        inside_de_paid_to: {
            type: Sequelize.TEXT
        },
        outside_de_paid_to: {
            type: Sequelize.TEXT
        },
        outside_de_payment_company: {
            type: Sequelize.TEXT
        },
        outside_de_payment_company_address: {
            type: Sequelize.TEXT
        },
        outside_de_payment_office: {
            type: Sequelize.TEXT
        },
        outside_de_payment_cell: {
            type: Sequelize.TEXT
        },
        outside_de_payment_fax: {
            type: Sequelize.TEXT
        },
        outside_de_payment_tax_id: {
            type: Sequelize.TEXT
        },
        outside_de_payment_mail: {
            type: Sequelize.TEXT
        }
	});

	return DealData;
}