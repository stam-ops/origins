module.exports = (sequelize, Sequelize) => {
  const Video = sequelize.define("video", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    }
  });
  return Video;
};
