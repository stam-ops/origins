module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
    videoId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'videos',
        key: 'id',
      }
    },
    userid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      }
    }
  },{
    timestamps: false
  }
);

return Favorite;
};
