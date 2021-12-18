let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let idtag;
const db = require("../models");
const User = db.user;
const AuthToken = db.authtoken;
const Favorite = db.favorite;

let savedtoken ="";
let savedtoken2 ="";
let idvideo,idvideo2;
chai.use(chaiHttp);


describe('User Model Tests', () => {

  // clean tag table
  before(function() {

    Favorite.destroy({
      where: {},
      truncate: false
    })

    User.destroy({
      where: {},
      truncate: false
    })

    AuthToken.destroy({
      where: {},
      truncate: false
    })

  })


  describe('/Register user', () => {
    it('it should create the user', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/register')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        savedtoken=res.body.token.token;
        done();
      });
    });

  });

  describe('/Logout user after register', () => {
    it('it should logout the user (remove authtoken)', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .delete('/users/logout')
      .send(user)
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
    });

  });


  describe('/Register user with same email', () => {
    it('it should not create the user', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/register')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Email already exists - try login');
        done();
      });
    });

  });

  describe('/Login user with wrong password', () => {
    it('it should login the user (create authtoken)', (done) => {
      let user = {
        email:"david@stam.app",
        password:"55555"
      };
      chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Invalid email or password');
        done();
      });
    });

  });

  describe('/Login user with wrong email', () => {
    it('it should login the user (create authtoken)', (done) => {
      let user = {
        email:"david10@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Invalid email or password');
        done();
      });
    });

  });

  describe('/Login user', () => {
    it('it should login the user (create authtoken)', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        savedtoken=res.body.token.token;
        done();
      });
    });

  });


  describe('/CREATE Video to test add favorite', () => {
    it('it should create video ', (done) => {
      let video3 = {
        name:"videoFav",
        url:"https:\\origins.com\idff33",
        description: "belle action"
      };
      chai.request(server)
      .post('/videos')
      .send(video3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        idvideo=res.body.id;
        done();
      });
    });

  });

  describe('/CREATE Video 2 to test add favorite', () => {
    it('it should create video ', (done) => {
      let vid = {
        name:"videoFav2",
        url:"https:\\origins.com\idf22f33",
        description: "itw de didier"
      };
      chai.request(server)
      .post('/videos')
      .send(vid)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        idvideo2=res.body.id;
        done();
      });
    });

  });


  describe('/Add Favorite video id not exists', () => {
    it('it should not add favorite', (done) => {
      let vid = {
        videoid:11111,
      };
      chai.request(server)
      .post('/users/addfavorite')
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .send(vid)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Video ID not exists');
        done();
      });
    });

  });


  describe('/Add Favorite', () => {
    it('it should add video to user favorite list', (done) => {
      let vid = {
        videoid:idvideo,
      };
      chai.request(server)
      .post('/users/addfavorite')
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .send(vid)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('userid');
        res.body.should.have.property('videoId');
        done();
      });
    });

  });

  describe('/Add Favorite 2 ', () => {
    it('it should add video to user favorite list', (done) => {
      let vid = {
        videoid:idvideo2,
      };
      chai.request(server)
      .post('/users/addfavorite')
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .send(vid)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('userid');
        res.body.should.have.property('videoId');
        done();
      });
    });

  });

  describe('/Add Favorite with same video ', () => {
    it('it should not add video to user favorite list', (done) => {
      let vid = {
        videoid:idvideo2,
      };
      chai.request(server)
      .post('/users/addfavorite')
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .send(vid)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Video already added for that user');
        done();
      });
    });

  });



  describe('/Get Favorite', () => {
    it('it should get favorites videos for user', (done) => {
      chai.request(server)
      .get('/users/getfavorite')
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.length.should.be.eql(2);
        res.body[0].name.should.be.eql("videoFav");
        res.body[1].name.should.be.eql("videoFav2");
        done();
      });
    });

  });


  describe('/Register user2 to test favorites', () => {
    it('it should create the user', (done) => {
      let user = {
        email:"david2@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/register')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        savedtoken2=res.body.token.token;
        done();
      });
    });

  });


  describe('/Add Favorite video to user 2', () => {
    it('it should add video to user favorite list', (done) => {
      let vid = {
        videoid:idvideo,
      };
      chai.request(server)
      .post('/users/addfavorite')
      .set({ "Authorization": `Bearer ${savedtoken2}` })
      .send(vid)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('userid');
        res.body.should.have.property('videoId');
        done();
      });
    });

  });


  describe('/Get Favorite for user 2', () => {
    it('it should get favorite video for user 2', (done) => {
      chai.request(server)
      .get('/users/getfavorite')
      .set({ "Authorization": `Bearer ${savedtoken2}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.length.should.be.eql(1);
        res.body[0].name.should.be.eql("videoFav");
        done();
      });
    });

  });






  describe('/Logout user after login', () => {
    it('it should logout the user (remove authtoken)', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .delete('/users/logout')
      .send(user)
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
    });

  });

});
