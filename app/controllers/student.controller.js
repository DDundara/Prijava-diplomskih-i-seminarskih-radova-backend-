const db = require("../models");
const Student = db.students;
const Op = db.Sequelize.Op;

// Create and Save a new Student
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Ime) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Student
  const Student = {
    StudentId: req.body.StudentId,
    Ime: req.body.Ime,
    Grad: req.body.Grad,
    Godiste: req.body.Godiste
  };

  // Save Student in the database
  Student.create(Student)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student."
      });
    });
};

// Retrieve all students from the database.
exports.findAll = (req, res) => {
  const Ime = req.query.Ime;
  var condition = Ime ? { Ime: { [Op.iLike]: `%${Ime}%` } } : null;

  Student.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students."
      });
    });
};

// Find a single Student with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Student with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Student with id=" + id
      });
    });
};

// Update a Student by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Student.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Student was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Student with id=" + id
      });
    });
};

// Delete a Student with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Student.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Student was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id
      });
    });
};

// Delete all students from the database.
exports.deleteAll = (req, res) => {
  Student.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} students were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all students."
      });
    });
};

// find all published Student
exports.findAllPublished = (req, res) => {
  Student.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students."
      });
    });
};
