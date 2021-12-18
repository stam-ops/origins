const db = require("../models");
const Video = db.video;
const Videotag = db.videotag;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
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

  // Creation
  const video = {
    name: req.body.name,
    url:req.body.url,
    description: req.body.description
  };

  Video.create(video)
  .then(data => {
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

exports.update = (req, res) => {
  const id = req.params.id;

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

exports.delete = (req, res) => {
  const id = req.params.id;

  Video.destroy({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Video was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Video with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete video with id=" + id
    });
  });
};

exports.deleteAll = (req, res) => {
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
