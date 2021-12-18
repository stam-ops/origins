
const db = require("../models");
const Tag = db.tag;
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let idtag;

chai.use(chaiHttp);

// TEST Tag
describe('Tag', () => {

  // clean tag table
  before(function() {
    Tag.destroy({
      where: {},
      truncate: false
    })

  })

  describe('/CREATE tag without value', () => {
    it('it should not create tag without value parameter', (done) => {
      let tag = {
      };
      chai.request(server)
      .post('/tags')
      .send(tag)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Tag Value mandatory');

        done();
      });
    });

  });


  describe('/CREATE Tag ', () => {
    it('it should create tag ', (done) => {
      let tag1 = {
        value:"tag123456"
      };
      chai.request(server)
      .post('/tags')
      .send(tag1)
      .end((err, res) => {
        idtag=res.body.id;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('value');
        done();
      });
    });

  });


  describe('/CREATE Tag with same value', () => {
    it('it should not create tag as value is unique ', (done) => {
      let tag1 = {
        value:"tag123456"
      };
      chai.request(server)
      .post('/tags')
      .send(tag1)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('Tag with value = tag123456 already exists');
        done();
      });
    });

  });

  describe('/Delete one tag, id not existing', () => {
    it('it should not delete tag', (done) => {
      chai.request(server)
      .delete('/tags/200')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Cannot delete Tag id=200.');
        done();
      });

    });

  });

  describe('/Delete one tag by id', () => {
    it('it should delete the tag', (done) => {
      chai.request(server)
      .delete('/tags/'+idtag)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Tag was deleted successfully!');
        done();
      });

    });

  });



});
