module.exports = app => {

app.get('/api/users', db2.getUsers)
app.get('/api/usersperpage/:page', db2.getUsersPerPage)
app.get('/api/usersandcities', db2.getUsersAndCities)
app.get('/api/cities', db2.getCities)
app.get('/api/userstotal', db2.getTotal)
app.get('/api/users/:id', db2.getUserById)
app.get('/api/useredit/:id', db2.getUserById)
app.get('/api/userdelete/:id', db2.getUserById)
app.post('/api/users', db2.createUser)
app.put('/api/users/:id', db2.updateUser)
app.delete('/api/users/:id', db2.deleteUser)

}