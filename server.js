const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: ["http://localhost:8081","http://localhost:8082"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
const db2 = require('./app/models/queries')
db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


app.get('/api/users', db2.getUsers)
app.get('/api/usersperpage/:page', db2.getUsersPerPage)
app.get('/api/usersandcities', db2.getUsersAndCities)
app.get('/api/cities', db2.getCities)
app.get('/api/sviradovi', db2.getAllRadovi)
app.get('/api/mojiradovi/:username', db2.getMojiRadovi)
app.get('/api/radovimentor/:username', db2.getRadoviMentor)
app.get('/api/radovimentorpretraga/:username', db2.getRadoviMentorPretraga)
app.get('/api/userstotal', db2.getTotal)
app.get('/api/users/:id', db2.getUserById)
app.get('/api/useredit/:id', db2.getUserById)
app.get('/api/workedit/:idrad/:radname/:idkat/:katname', db2.getUserById)
app.get('/api/workgrade/:idrad/:radname/:idkat/:katname', db2.getUserById)
app.get('/api/mentorsbycategory/:idkat/:iduser', db2.getMentoriByKategorija)
app.get('/api/prosjekocjenapokategoriji', db2.ProsjekOcjenaPoKategoriji)
app.get('/api/userdelete/:id', db2.getUserById)
app.get('/api/kategorije', db2.getKategorije)
app.get('/api/statusi', db2.getStatusi)
app.post('/api/users', db2.createUser)
app.post('/api/sviradovi', db2.createWork)
app.post('/api/svimentorirad', db2.createMentorRad)
app.get('/api/workmentors/:idrad/:radname', db2.getMentoriSpecifRada)
app.get('/api/provjeriocjenuradamentora/:idrad/:idment', db2.ProvjeriOcjenuRadaMentora)
app.put('/api/users/:id', db2.updateUser)
app.put('/api/radovimentor/:username', db2.updateWorkGrade)
app.put('/api/workstatus/:idrad', db2.updateWorkStatus)
app.put('/api/workacceptance/:idrad/:ocjena', db2.updateWorkAcceptance)
app.get('/api/isworkaccepted/:idrad', db2.IsWorkAccepted)
app.delete('/api/users/:id', db2.deleteUser)

require("./app/routes/turorial.routes")(app);
require("./app/routes/student.routes")(app);
require("./app/routes/dvorana.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
