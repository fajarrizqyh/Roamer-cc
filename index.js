// index.js
const express = require('express');
const bodyParser = require('body-parser');
const routes_user = require('./routes/user_routes');
const routes_log = require('./routes/logbook_routes');
const routes_places = require('./routes/places_routes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'doc')));
app.use('/user', routes_user);
app.use('/activity', routes_log);
app.use('/places', routes_places);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
