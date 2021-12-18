
module.exports = (sequelize, Sequelize) => {
  const Videotag = sequelize.define("videotag", {
    videoid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'videos',
        key: 'id',
      }
    },
    tagid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      }
    }
  },{
    timestamps: false
  }
);

return Videotag;
};
