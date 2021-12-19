const db = require("../models");
const User = db.user;
const AuthToken = db.authtoken;
const Favorite = db.favorite;
const Video = db.video;
const Op = db.Sequelize.Op;

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
    return res.status(400).send({
      message:
      "Email already exists - try login"
    });
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
    return res.status(400).send({
      message:
      "Invalid email or password"
    });
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


exports.addfavorite  = async  (req, res) =>  {

  const authToken = fromHeaderOrQueryString(req);

  if (authToken) {
    try {
      const user= await User.checkauth(authToken);

      const video = {
        videoId: req.body.videoid,
        userid:user.id
      };


      const videoCheck = await Video.findAll({ where: { id: req.body.videoid } });

      if (videoCheck.length==0){
        res.status(400).send({
          message: "Video ID not exists"
        });
        return;
      }

      const favoriteCheck = await Favorite.findAll({ where: {
        [Op.and]: [{ videoId: req.body.videoid }, { userid : user.id}]
      } });

      if (favoriteCheck.length>0){
        res.status(400).send({
          message: "Video already added for that user"
        });
        return;
      }


      Favorite.create(video)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || "Some error occurred while adding favorite video."
        });
      });

    } catch (err) {
      return res.status(400).send(err+'not authenticated - token not valid');
    }

  }
  else{
    return res.status(400).send(
      { errors: [{ message: 'not authenticated - can not read token' }] }
    );
  }


};


exports.getfavorite  = async  (req, res) =>  {

  const authToken = fromHeaderOrQueryString(req);

  if (authToken) {
    try {
      const user= await User.checkauth(authToken);

      const data = await Video.findAll({
        include: [{
          model: Favorite,
          as: "favorites",
          where: {
            userid: user.id
          }
        }]
      })

      res.send(data);

    } catch (err) {
      return res.status(400).send(err+'not authenticated - token not valid');
    }

  }
  else{
    return res.status(400).send(
      { errors: [{ message: 'not authenticated - can not read token' }] }
    );
  }


};



function fromHeaderOrQueryString (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  return req.headers.authorization.split(' ')[1];
  else if (req.query && req.query.token)
  return req.query.token;

  return null;
}
