const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: ["http://localhost:8081","http://localhost:8082","https://webapps-darkodundara-frontend.onrender.com"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */


const db2 = require('./app/models/queries')


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Aplikacija za predaju diplomskih i seminarskih radova." });
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
app.post('/api/kategorijesve', db2.createKategorija)
app.post('/api/cities', db2.createNoviGrad)
app.get('/api/kategorijementorialljoin', db2.getKategorijeMentoriAllJoin)
app.post('/api/kategorijementorialljoin', db2.createKategorijaMentor)
app.get('/api/kategorije', db2.getKategorije)
app.get('/api/kategorijesve', db2.getKategorijeSve)
app.get('/api/svimentori', db2.getAllMentori)
app.get('/api/svimentoriadd/:idkat/:katname', db2.getAllMentoriForAdd)
app.get('/api/kategorijementori/:idkat/:katname', db2.getKategorijeMentori)
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
app.delete('/api/kategorijesve/:idzapis', db2.removeMentorFromCategory)
app.get('/api/azurirajkategoriju/:idkat', db2.getKategorijaById)
app.put('/api/kategorijesve/:idkat', db2.updateKategorija)
app.get('/api/radoviadmin/:page', db2.getRadoviAdmin)
app.get('/api/radoviadminpretraga', db2.getRadoviAdminPretraga)
app.get('/api/radovitotal', db2.getRadoviTotal)
app.delete('/api/radovitotal', db2.deleteWork)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
