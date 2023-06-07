module.exports = app => {
  const students = require("../controllers/student.controller.js");
  const dvorane = require("../controllers/dvorane.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  //router.post("/", students.create);

  // Retrieve all Tutorials
  router.get("/", dvorane.findAll);

  // Retrieve all published Tutorials
  //router.get("/published", students.findAllPublished);

  // Retrieve a single Tutorial with id
  //router.get("/:id", students.findOne);

  // Update a Tutorial with id
 // router.put("/:id", students.update);

  // Delete a Tutorial with id
  //router.delete("/:id", students.delete);

  // Create a new Tutorial
  //router.delete("/", students.deleteAll);

  app.use("/api/dvorane", router);
};
