/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
import { DataTypes } from "sequelize/types";
export default (sequelize, Sequelize) => {
	const RoleData = sequelize.define('role_data', {
		deal_id: {
            type: DataTypes.TEXT
        },
        role_id: {
            type: DataTypes.TEXT
        },
        share_percent: {
            type: DataTypes.NUMBER
        },
        note: {
            type: DataTypes.TEXT
        },
        payment_unit_type: {
            type: DataTypes.INTEGER
        },
        payment_value: {
            type: DataTypes.INTEGER
        },
        
	});

	return RoleData;
}