const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=742bc89726d5591bf65e5805f706a41c&query=' + latitude + ',' + longitude 
    //+ '&units=f'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently " +
            body.current.temperature + " degress out. It feells like " + 
            body.current.feelslike + " degress out. The humidity is " + body.current.humidity + '%.') 
        }
    })
}

module.exports = forecast