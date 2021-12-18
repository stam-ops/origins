const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: "postgres",
  operatorsAliases: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.video = require("./video.model.js")(sequelize, Sequelize);
db.tag = require("./tag.model.js")(sequelize, Sequelize);
db.videotag = require("./videotag.model.js")(sequelize, Sequelize);
db.authtoken=require("./auth.token.model.js")(sequelize, Sequelize);
db.user=require("./user.model.js")(db,sequelize, Sequelize);

db.user.hasMany(db.authtoken, { as: "AuthTokens" });


module.exports = db;
