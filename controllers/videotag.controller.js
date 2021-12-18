const db = require("../models");
const Videotag = db.videotag;
const Tag = db.tag;
const Video = db.video;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validation
  if (!req.body.videoid) {
    res.status(400).send({
      message: "Video ID mandatory"
    });
    return;
  }

  if (!req.body.tagid) {
    res.status(400).send({
      message: "Tag ID mandatory"
    });
    return;
  }

  Video.findAll({ where: { id: req.body.videoid } }).then(data => {
    if (data.length==0){
      res.status(400).send({
        message: "Video ID not exists"
      });
      return;
    }

    else{

      Tag.findAll({ where: { id: req.body.tagid } }).then(data => {
        if (data.length==0){
          res.status(400).send({
            message: "Tag ID not exists"
          });
          return;
        }

        else{
          // Creation
          const videotag = {
            videoid: req.body.videoid,
            tagid:req.body.tagid
          };

          // Save
          Videotag.create(videotag)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
              err.message || "Some error occurred while creating association between tag and video."
            });
          });
       }
      });
    }
  });


};

exports.findAll = (req, res) => {

  Videotag.findAll()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving video tags."
    });
  });
};



exports.delete = (req, res) => {
  const id = req.params.id;
  Videotag.destroy({
    where: { id: id }
  })
  .then(num => {
    console.log("num="+num);
    if (num == 1) {
      res.send({
        message:  `Tag was removed successfully from video`
      });
    } else {
      res.send({
        message: `Cannot delete association tag video id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete association tag video with id=" + id
    });
  });
};
