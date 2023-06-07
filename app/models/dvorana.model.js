module.exports = (sequelize, Sequelize) => {
  const Dvorana = sequelize.define("dvorana", {
    DvoranaId: {
      type: Sequelize.INTEGER
    },
    Naziv: {
      type: Sequelize.STRING
    }
  });

  return Dvorana;
};
