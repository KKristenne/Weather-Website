const path = require('path');
const express = require('express');
const hbs = require('hbs');
const { request } = require('express');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;/

// Define paths for Express config
const publicDiretoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDiretoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Kleine Kristenne David',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Kleine Kristenne David',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'I need help',
    name: 'Kleine Kristenne David',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send('ERROR: You must provide an address!');
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({ error });
        }
        forecast(longitude, latitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }

          res.send({
            location: location,
            forecastData: forecastData,
            address: req.query.address,
          });
        });
      }
    );
  }
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404help', {
    message: '404: Help article not found',
    linkText: 'Click the link below to return to homepage.',
    name: 'Kleine Kristenne David',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    msg: '404: Page not found',
    linkText: 'Click the link below to return to homepage.',
    name: 'Kleine Kristenne David',
  });
});

app.listen(port, () => {
  console.log('Server is up on port port.');
});
