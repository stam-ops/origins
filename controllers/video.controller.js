const db = require("../models");
const Video = db.video;
const Videotag = db.videotag;
const Op = db.Sequelize.Op;
const elastic = require("./elastic.js");



exports.create = async (req, res) => {
  // Validation
  if (!req.body.name) {
    res.status(400).send({
      message: "Name mandatory"
    });
    return;
  }

  if (!req.body.url) {
    res.status(400).send({
      message: "URL mandatory"
    });
    return;
  }


  const videoCheck = await Video.findAll({ where: {name: req.body.name  } });

  if (videoCheck.length>0){
    res.status(400).send({
      message: "Video with that name already exists"
    });
    return;
  }


  // Creation
  const video = {
    name: req.body.name,
    url:req.body.url,
    description: req.body.description
  };

  Video.create(video)
  .then(data => {

    // send info to elastic cloud

    elastic.run(req.body.name,req.body.description).catch(console.log)

    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the video."
    });
  });

};


const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: videos } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, videos, totalPages, currentPage };
};


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.findAll = (req, res) => {

  const { page, size, name } = req.query;

  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  const { limit, offset } = getPagination(page, size);

  Video.findAndCountAll({ where: condition, limit, offset })
  .then(data => {
    const response = getPagingData(data, page, limit);
    res.send(response);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving videos."
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Video.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find video with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving video with id=" + id
    });
  });
};

exports.findByKeyWord = async (req, res) => {

  const keyword = req.params.keyword;

  const result=await elastic.searchkeyword(keyword).catch(console.log)

res.send(result);

}


exports.update = async (req, res) => {
  const id = req.params.id;

  const checkVideo = await Video.findAll({ where: { id: id } });

  if (checkVideo.length==0){
    res.status(400).send({
      message: "Video ID not exists"
    });
    return;
  }

  // check if video name is avalaible

if (req.body.name){
  const checkVideoName = await Video.findAll({ where: { name : req.body.name } });

  if (checkVideoName.length>0){
    res.status(400).send({
      message: "Video name already in use"
    });
    return;
  }

}

  const elasticId=await elastic.read(checkVideo[0].name).catch(console.log)

  elastic.updateVideo(elasticId,req.body.name,req.body.description).catch(console.log)


  Video.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Video was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update video with id=${id}. The video doesn't exist or body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating video with id=" + id
    });
  });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  const checkVideo = await Video.findAll({ where: { id: id } });

  if (checkVideo.length==0){
    res.status(400).send({
      message: "Video ID not exists"
    });
    return;
  }

  const checkVideoTag = await  Videotag.findAll({ where: {videoid: id  } });

  if (checkVideoTag.length!=0){
    // remove all video tags
    for (let i = 0; i < checkVideoTag.length; i++) {
      Videotag.destroy({
        where: { id: checkVideoTag[i].id }
      })

    }
  }


  const videodestroy = await Video.destroy({ where: { id: id } });

  if (videodestroy == 1){
    // delete elactic
    const elasticId=await elastic.read(checkVideo[0].name).catch(console.log)
    elastic.removeVideo(elasticId).catch(console.log)

    res.send({
      message: "Video was deleted successfully!"
    });
  }else {
    res.send({
      message: `Cannot delete Video with id=${id}.`
    });
  }




};

exports.deleteAll = async (req, res) => {


  Videotag.destroy({
    where: {},
    truncate: false
  })

  const checkVideo = await Video.findAll();

  if (checkVideo.length==0){
    res.status(400).send({
      message: "No video"
    });
    return;
  }

  // clean elactic elasticsearch

  for (let i = 0; i < checkVideo.length; i++) {
    console.log("video name to delete"+checkVideo[i].name);
    const elasticId=await elastic.read(checkVideo[i].name).catch(console.log)
    console.log("elasticId to delete"+elasticId);
    elastic.removeVideo(elasticId).catch(console.log)
  }

  Video.destroy({
    where: {},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Videos were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while removing all videos."
    });
  });
};



// Find videos by tag
exports.findByTag = (req, res) => {
  const id = req.params.id;

  Videotag.findAll({ where: {tagid:id } })
  .then(data => {

    if (data.length==0){
      res.status(400).send({
        message: "No video with that Tag"
      });
      return;
    }

    videoids=[];
    data.map(function(val) {
      videoids.push(val.videoid);
    });

    Video.findAll({
      where: {
        id:{
          [Op.or]: videoids
        }
      }
    }).then(data => {
      res.send(data);
    });


  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving videos from tag."
    });
  });


};
