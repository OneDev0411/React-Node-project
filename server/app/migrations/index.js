"use strict";

var Sequelize = require("sequelize");

var info = {
  revision: 1,
  name: "noname",
  created: "2022-07-12T15:49:58.814Z",
  comment: "",
};

var migrationCommands = [
  {
    fn: "createTable",
    params: [
      "DealDatas",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        deal_id: {
          type: Sequelize.TEXT,
        },
        gci_calculate_type: {
          type: Sequelize.INTEGER,
        },
        gci_de_value: {
          type: Sequelize.FLOAT,
        },
        gci_reason_select: {
          type: Sequelize.INTEGER,
        },
        gci_reason: {
          type: Sequelize.TEXT,
        },
        stage_cost: {
          type: Sequelize.FLOAT,
        },
        remittance_bank_wire_amount: {
          type: Sequelize.FLOAT,
        },
        inside_de_payment_type: {
          type: Sequelize.TEXT,
        },
        inside_de_paid_to: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_type: {
          type: Sequelize.TEXT,
        },
        outside_de_paid_to: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_company: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_company_address: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_office: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_cell: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_fax: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_tax_id: {
          type: Sequelize.TEXT,
        },
        outside_de_payment_mail: {
          type: Sequelize.TEXT,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {},
    ],
  },

  {
    fn: "createTable",
    params: [
      "RoleDatas",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        deal_id: {
          type: Sequelize.TEXT,
        },
        role_id: {
          type: Sequelize.TEXT,
        },
        legal_full_name: {
          type: Sequelize.TEXT,
        },
        role: {
          type: Sequelize.TEXT,
        },
        share_percent: {
          type: Sequelize.FLOAT,
        },
        share_value: {
          type: Sequelize.REAL,
        },
        note: {
          type: Sequelize.TEXT,
        },
        payment_unit_type: {
          type: Sequelize.INTEGER,
        },
        payment_value: {
          type: Sequelize.FLOAT,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {},
    ],
  },

  {
    fn: "createTable",
    params: [
      "RemittanceChecks",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        deal_id: {
          type: Sequelize.TEXT,
        },
        check_num: {
          type: Sequelize.INTEGER,
        },
        check_date: {
          type: Sequelize.DATE,
        },
        check_receive_date: {
          type: Sequelize.DATE,
        },
        amount: {
          type: Sequelize.FLOAT,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {},
    ],
  },

  {
    fn: "createTable",
    params: [
      "DealInfos",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        deal_id: {
          type: Sequelize.STRING,
        },
        data: {
          type: Sequelize.JSONB,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {},
    ],
  },
];

var rollbackCommands = [
  {
    fn: "dropTable",
    params: ["DealDatas"],
  },
  {
    fn: "dropTable",
    params: ["RoleDatas"],
  },
  {
    fn: "dropTable",
    params: ["RemittanceChecks"],
  },
  {
    fn: "dropTable",
    params: ["DealInfos"],
  },
];

module.exports = {
  pos: 0,
  up: function (queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn]
            .apply(queryInterface, command.params)
            .then(next, reject);
          // @ts-ignore
        } else resolve();
      }
      next();
    });
  },
  down: function (queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
          let command = rollbackCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn]
            .apply(queryInterface, command.params)
            .then(next, reject);
          // @ts-ignore
        } else resolve();
      }
      next();
    });
  },
  info: info,
};
