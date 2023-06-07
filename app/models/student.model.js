module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    StudentId: {
      type: Sequelize.INTEGER
    },
    Ime: {
      type: Sequelize.STRING
    },
    Grad: {
      type: Sequelize.STRING
    },
    Godiste: {
      type: Sequelize.INTEGER
    }
  });

  return Student;
};
