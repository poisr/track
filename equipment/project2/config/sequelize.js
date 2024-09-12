const { Sequelize } = require('sequelize');
const path = require('path');
const config = require(path.join(__dirname, 'config.json'));

const environment = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[environment]);

module.exports = sequelize;
