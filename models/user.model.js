const bcrypt = require('bcrypt');
const db = require("./index.js");


module.exports = (db,sequelize, Sequelize) => {

  const User = sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {});


  const AuthToken = db.authtoken;


  User.authenticate = async function(email, password) {

    const user = await User.findOne({ where: { email } });

    if (bcrypt.compareSync(password, user.password)) {
      return user.authorize();
    }

    throw new Error('invalid password');
  }


  User.prototype.authorize = async function () {
    const user = this
    const token = await AuthToken.generate(this.id);

    await user.addAuthtoken(token);

    return { user, token }
  };


  User.logout = async function (token) {
    AuthToken.destroy({ where: { token } });
  };

  return User;
};
