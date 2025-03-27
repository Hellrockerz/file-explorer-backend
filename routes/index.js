const express = require("express");
const app = express()

const userRoutes = require('./userRoutes')
const filesRoutes = require('./filesRoutes')

app.use('/user', userRoutes)
app.use('/file', filesRoutes)

module.exports = app;