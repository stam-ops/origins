const db = require("../models");
const User = db.user;
const AuthToken = db.authtoken;
const bcrypt = require('bcrypt');


  exports.register  = async  (req, res) =>  {

  const hash = bcrypt.hashSync(req.body.password, 10);

  try {
    // create a new user
    let user = await User.create(
      Object.assign(req.body, { password: hash })
    );

    let data = await user.authorize();

    return res.json(data);

  } catch(err) {
    if (err.name=="SequelizeUniqueConstraintError")
    return res.status(400).send("email already exists - try login");
    return res.status(400).send(err);
  }

};


exports.login  = async  (req, res) =>  {

const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send(
      'Request missing email or password param'
    );
  }

  try {
    let user = await User.authenticate(email, password)

    return res.json(user);

  } catch (err) {
    return res.status(400).send(err+'invalid email or password');
  }

};



exports.logout  = async  (req, res) =>  {

 const authToken = fromHeaderOrQueryString(req);

  if (authToken) {
    await User.logout(authToken);
    return res.status(204).send()
  }

  return res.status(400).send(
    { errors: [{ message: 'not authenticated' }] }
  );
};


function fromHeaderOrQueryString (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
            return req.headers.authorization.split(' ')[1];
        else if (req.query && req.query.token)
            return req.query.token;

        return null;
      }
