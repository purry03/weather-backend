const path = require('path')

const chalk = require('chalk');


global.__basedir = path.resolve(__dirname);

const fs = require('fs');

const countryData = JSON.parse(fs.readFileSync(__basedir + "\\data\\countries_expanded.json"));

let numberOfCities = 0, equator = 0

countryData.forEach((country) => {
    country.states.forEach((state) => {
        state.cities.forEach((city) => {
            numberOfCities += 1
            if (parseInt(city.latitude) >= -23.5 && parseInt(city.latitude) <= 23.5 && country.name == "India") {
                console.log(chalk.green(city.name) + " , " + state.name + " , " + chalk.yellowBright(country.name))
                equator += 1
            }
        })
    })
})

console.log(numberOfCities, equator)