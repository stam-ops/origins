const db = require("../models");
const Tag = db.tag;
const Op = db.Sequelize.Op;
const Videotag = db.videotag;

exports.create = (req, res) => {
  // Validation
  if (!req.body.value) {
    res.status(400).send({
      message: "Tag Value mandatory"
    });
    return;
  }

  Tag.findAll({ where: { value : req.body.value } }).then(data => {

    if (data.length>0){
      res.status(404).send({
        message: `Tag with value = `+req.body.value +` already exists`
      });
    }
    else{
      // Creation
      const tag = {
        value: req.body.value,
      };

      // Save
      Tag.create(tag)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || "Some error occurred while creating the tag."
        });
      });



    }
  });



};

exports.findAll = (req, res) => {

  const value = req.query.value;
  var condition = value ? { value: { [Op.like]: `%${value}%` } } : null;

  Tag.findAll({ where: condition })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving tags."
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Tag.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find tag with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving video with id=" + id
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Videotag.findAll({ where: { tagid: id } }).then(data => {

    if (data.length>0){
      res.status(404).send({
        message: `Tag id = `+id+` is associated with one or more videos. Please remove video tag before.`
      });
    }
    else{
      Tag.destroy({
        where: { id: id }
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tag was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Tag id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: err+"Could not delete tag with id=" + id
        });
      });
    }

  });


};
