// Typically i require my -> 'core' modules ->  before i require my -> 'npm' modules (just to stay organized)

const path = require('path')
const express = require('express') 
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Lyuba Petrova' 
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me', 
        name: 'Lyuba Petrova'
    })
})

// Setup help 'route handler' 
// render a template for -> 'help.hbs' (handlebar)
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpfull text.',
        title: 'Help',
        name: 'Lyuba Petrova'
    })
})
// app.com/weather (route handler) (endpoint)
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!!!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {     
        if (error) {
            return res.send({ error })
        }     
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData, 
                location,
                address: req.query.address
            })
        })
    })  
})
//
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

// Setup 404 'route handler' for -> 'app.com/help/*' page  
// render a template for -> '404.hbs' (handlebar)
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Lyuba Petrova',
        errorMessage: 'Help article not found'
    })
})

// Setup 404 'route handler' for -> 'app.com/*' page   (this 'route' needs to come last)
// render a template for -> '404.hbs' (handlebar)
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Lyuba Petrova',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
// 