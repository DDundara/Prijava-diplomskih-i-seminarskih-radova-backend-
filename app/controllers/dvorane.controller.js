const db = require("../models");
const Dvorana = db.dvorana;
//const Op = db.Sequelize.Op;

// Create and Save a new Dvorana
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Naziv) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Dvorana
  const Dvorana = {
    DvoranaId: req.body.DvoranaId,
    Naziv: req.body.Naziv
  };

  // Save Dvorana in the database
  Dvorana.create(Dvorana)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Dvorana."
      });
    });
};

// Retrieve all dvoranes from the database.
exports.findAll = (req, res) => {
  const Naziv = req.query.Naziv;
  var condition = Naziv ? { Naziv: { [Op.iLike]: `%${Naziv}%` } } : null;

  Dvorana.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dvoranes."
      });
    });
};

// Find a single Dvorana with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Dvorana.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Dvorana with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Dvorana with id=" + id
      });
    });
};

// Update a Dvorana by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Dvorana.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Dvorana was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Dvorana with id=${id}. Maybe Dvorana was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Dvorana with id=" + id
      });
    });
};

// Delete a Dvorana with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Dvorana.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Dvorana was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Dvorana with id=${id}. Maybe Dvorana was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Dvorana with id=" + id
      });
    });
};

// Delete all dvoranes from the database.
exports.deleteAll = (req, res) => {
  Dvorana.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} dvoranes were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all dvoranes."
      });
    });
};

// find all published Dvorana
exports.findAllPublished = (req, res) => {
  Dvorana.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dvoranes."
      });
    });
};
