module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define("tag", {
    value: {
      type: Sequelize.STRING,
      unique: true
    }
  },{
  timestamps: false
}
);
  return Tag;
};
