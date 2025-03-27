require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
app.use(cors({ origin: '*' }));

const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const routes = require('./routes/index');

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log(`MongoDB connected at ${MONGODB_URI}`);
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use('/api', routes);

server.listen(port, () => {
  console.log(`Server is running on http://172.16.1.131:${port}`);
});
