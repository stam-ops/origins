const db = require("../models");
const Videotag = db.videotag;
const Tag = db.tag;
const Video = db.video;
const Op = db.Sequelize.Op;

const elastic = require("./elastic.js");


exports.create = async (req, res) => {
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

  const checkVideo = await Video.findAll({ where: { id: req.body.videoid } });

  if (checkVideo.length==0){
    res.status(400).send({
      message: "Video ID not exists"
    });
    return;
  }

  const checkTag = await  Tag.findAll({ where: { id: req.body.tagid } });

  if (checkTag.length==0){
    res.status(400).send({
      message: "Tag ID not exists"
    });
    return;
  }

  const checkVideoTag = await  Videotag.findAll({ where: {
    [Op.and]: [{ videoid: req.body.videoid }, { tagid : req.body.tagid}]
  } });

  if (checkVideoTag.length!=0){
    res.status(400).send({
      message: "Video already tagged with that tag"
    });
    return;
  }

  // Creation
  const videotag = {
    videoid: req.body.videoid,
    tagid:req.body.tagid
  };


// Update Elastic

const elasticId=await elastic.read(checkVideo[0].name).catch(console.log)
elastic.addTag(elasticId,checkTag[0].value);

  // Save
  Videotag.create(videotag)
  .then(data => {

    // Update Elastic info for that video

    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating association between tag and video."
    });
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



exports.delete = async (req, res) => {
  const id = req.params.id;


  // Update Elastic to remove tag for that video

  const checkVideoTag = await  Videotag.findAll({ where: {id:id } });

  if (checkVideoTag.length==0){
    res.status(400).send({
      message: "Cannot delete association tag video id="+id
    });
    return;
  }


  const checkVideo = await Video.findAll({ where: { id: checkVideoTag[0].videoid } });
  const checkTag = await  Tag.findAll({ where: { id: checkVideoTag[0].tagid } });

  const elasticId=await elastic.read(checkVideo[0].name).catch(console.log)
  elastic.removetag(elasticId,checkTag[0].value);


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
