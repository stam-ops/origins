
const db = require("../models");
const Video = db.video;
const VideoTag = db.videotag;
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let idvideo1,idvideo2,idvideo3;
let idtag;
let idtagassoc;

// TESTs CRUD - VIDEO

chai.use(chaiHttp);

describe('Video', () => {


  // clean video table and video <-> tag associations
  before(function() {
    VideoTag.destroy({
      where: {},
      truncate: false
    })

    Video.destroy({
      where: {},
      truncate: false
    })
  })


  describe('/GET video', () => {
    it('it should GET no video', (done) => {
      chai.request(server)
      .get('/videos?page=0&size=10')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.videos.length.should.be.eql(0);
        done();
      });
    });
  });

  describe('/CREATE Video', () => {
    it('it should create video ', (done) => {
      let video1 = {
        name:"video1",
        url:"https:\\origins.com\id21",
        description: "super but de paris"
      };
      chai.request(server)
      .post('/videos')
      .send(video1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        done();
      });
    });

  });

  describe('/CREATE Video 2', () => {
    it('it should create video ', (done) => {
      let video2 = {
        name:"video2",
        url:"https:\\origins.com\id22",
        description: "allez st etienne"
      };
      chai.request(server)
      .post('/videos')
      .send(video2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        done();
      });
    });

  });

  describe('/CREATE Video 3', () => {
    it('it should create video ', (done) => {
      let video3 = {
        name:"video3",
        url:"https:\\origins.com\id33",
        description: "iterview de mbappe"
      };
      chai.request(server)
      .post('/videos')
      .send(video3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        idvideo3=res.body.id;
        done();
      });
    });

  });

  describe('/CREATE Video KO 1', () => {
    it('it should not create video without name parameter', (done) => {
      let video1 = {
        url:"https:\\origins.com\id21",
        description: "super but de paris"
      };
      chai.request(server)
      .post('/videos')
      .send(video1)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Name mandatory');

        done();
      });
    });

  });

  describe('/CREATE Video KO 2', () => {
    it('it should not create video without url parameter', (done) => {
      let video1 = {
        name:"videoAA",
        description: "super but de paris"
      };
      chai.request(server)
      .post('/videos')
      .send(video1)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('URL mandatory');

        done();
      });
    });

  });

  describe('/Get one video by name video1', () => {
    it('it should get the video infos', (done) => {

      chai.request(server)
      .get('/videos?name=video1&page=0&size=10')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.videos.length.should.be.eql(1);
        idvideo1=res.body.videos[0].id;
        done();
      });

    });

  });

  describe('/Get one video by name video2', () => {
    it('it should get the video infos', (done) => {

      chai.request(server)
      .get('/videos?name=video2&page=0&size=10')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.videos.length.should.be.eql(1);
        idvideo2=res.body.videos[0].id;
        done();
      });

    });

  });

  describe('/Get KO video by name not existing', () => {
    it('it should not find video name', (done) => {

      chai.request(server)
      .get('/videos?name=xxxx&page=0&size=10')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.videos.length.should.be.eql(0);
        done();
      });

    });

  });


  describe('/Get one video by id 200 not existing', () => {
    it('it should not get the video', (done) => {

      chai.request(server)
      .get('/videos/200')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('Cannot find video with id=200.');
        done();
      });

    });

  });


  describe('/Update video by id', () => {
    it('it should update the video with new description', (done) => {

      let newinfo = {
        description: "super but de marseille"
      };

      chai.request(server)
      .put('/videos/'+idvideo1)
      .send(newinfo)
      .end((err, res) => {
        res.should.have.status(200);

        res.body.should.have.property('message').eql('Video was updated successfully.');

        done();
      });

    });

  });

  describe('/Get one video by id', () => {
    it('it should get the video', (done) => {

      chai.request(server)
      .get('/videos/'+idvideo1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        done();
      });

    });

  });

  describe('/Delete one video by id', () => {
    it('it should delete the video', (done) => {

      chai.request(server)
      .delete('/videos/'+idvideo1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Video was deleted successfully!');
        done();
      });

    });

  });

  describe('/Delete one video by id 200 not existing', () => {
    it('it should not delete the video', (done) => {

      chai.request(server)
      .delete('/videos/'+200)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Cannot delete Video with id=200.');
        done();
      });

    });

  });


  // Tag <--> Video association

  describe('/CREATE Tag ', () => {
    it('it should create tag ', (done) => {
      let tag1 = {
        value:"tagvid"+Math.random(3)
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

  describe('/Add tag to a video', () => {

    it('it should add tag to the video', (done) => {
      let videotag = {
        "videoid":idvideo2,
        "tagid":idtag
      }
      chai.request(server)
      .post('/videotag')
      .send(videotag)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('videoid');
        res.body.should.have.property('tagid');
        idtagassoc=res.body.id;
        done();
      });
    });

  });

  describe('/Add tag to a video KO - video id not exists', () => {

    it('it should not tag the video', (done) => {
      let videotag = {
        "videoid":10000,
        "tagid":idtag
      }
      chai.request(server)
      .post('/videotag')
      .send(videotag)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Video ID not exists');

        done();
      });
    });

  });


  describe('/Add tag to a video KO - tag id not exists', () => {

    it('it should not tag the video', (done) => {
      let videotag = {
        "videoid":idvideo2,
        "tagid":10000
      }
      chai.request(server)
      .post('/videotag')
      .send(videotag)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message').eql('Tag ID not exists');

        done();
      });
    });

  });


  describe('/Remove tag from video', () => {
    it('it should remove the tag from the video', (done) => {

      chai.request(server)
      .delete('/videotag/'+idtagassoc)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Tag was removed successfully from video');
        done();
      });

    });

  });

  describe('/Remove tag from video - id 200 not existing', () => {
    it('it should not remove the tag - return error message', (done) => {

      chai.request(server)
      .delete('/videotag/'+200)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql("Cannot delete association tag video id=200.");
        done();
      });

    });

  });


  // Get videos by tag
  // user knows tagid (using  /tags?value="xxx" request)


  describe('/Add tag to a video 1', () => {

    it('it should add tag to the video', (done) => {
      let videotag = {
        "videoid":idvideo2,
        "tagid":idtag
      }
      chai.request(server)
      .post('/videotag')
      .send(videotag)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('videoid');
        res.body.should.have.property('tagid');
        idtagassoc=res.body.id;
        done();
      });
    });

  });


  describe('/Add tag to a video 2', () => {

    it('it should add tag to the video', (done) => {
      let videotag = {
        "videoid":idvideo3,
        "tagid":idtag
      }
      chai.request(server)
      .post('/videotag')
      .send(videotag)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('videoid');
        res.body.should.have.property('tagid');
        idtagassoc=res.body.id;
        done();
      });
    });

  });


  describe('/GET video by tag id', () => {

    it('it should GET videos with that tag', (done) => {

      chai.request(server)
      .get('/videos/bytag/'+idtag)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.length.should.be.eql(2);
        done();
      });
    });
  });

});
