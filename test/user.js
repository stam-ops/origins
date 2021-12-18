let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let idtag;
const db = require("../models");
const User = db.user;
const AuthToken = db.authtoken;
let savedtoken ="";
chai.use(chaiHttp);


describe('User Model Tests', () => {

  // clean tag table
  before(function() {
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

  describe('/Login user', () => {
    it('it should lpogin the user (create authtoken)', (done) => {
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

  describe('/Logout user', () => {
    it('it should logout the user (remove authtoken)', (done) => {
      let user = {
        email:"david@stam.app",
        password:"12345"
      };
      chai.request(server)
      .post('/users/logout')
      .send(user)
      .set({ "Authorization": `Bearer ${savedtoken}` })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

  });

});
