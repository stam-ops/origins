module.exports = (sequelize, Sequelize) => {

  const AuthToken = sequelize.define('authtoken', {
    token: Sequelize.STRING
  }, {});

  // generates a random 15 character token for a user
  AuthToken.generate = async function(UserId) {
    if (!UserId) {
      throw new Error('AuthToken requires a user ID')
    }

    let token = '';

    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 15; i++) {
      token += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
    }

    return AuthToken.create({ token, UserId })
  }

  return AuthToken;
};
