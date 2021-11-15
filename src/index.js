const path = require('path')

global.__basedir = path.resolve(__dirname + "\\..\\");

require('dotenv').config({ path: __dirname + "/../.env" });

const express = require('express')
const cors = require('cors');
const app = express();

const { distance } = require('fastest-levenshtein')
const fs = require('fs');

const weather = require('weather-js');

const countryData = JSON.parse(fs.readFileSync(__basedir + "\\data\\countries_expanded.json"));

app.use(cors());
app.options('*', cors());


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.info("Server online PORT " + process.env.PORT)
    }
});

app.get("/search/:query", (req, res) => {
    const { query } = req.params;

    if (query.length < 3) {
        res.sendStatus(400);
        return;
    }

    let searchResults = []



    countryData.forEach((country) => {
        country.states.forEach((state) => {
            state.cities.forEach((city) => {
                if (city.name.toUpperCase().includes(query.trim().toUpperCase())) {
                    searchResults.push({
                        city: city.name, state: state.name, country: country.name, string: city.name + " , " + state.name + " , " + country.name, relevance: 1 / (distance(city.name.toUpperCase(), query.trim().toUpperCase() + 1))
                    })
                }
            })
        })
    })



    function compare(a, b) {
        if (a.relevance < b.relevance) {
            return 1;
        }
        if (a.relevance > b.relevance) {
            return -1;
        }
        return 0;
    }

    searchResults.sort(compare);

    res.send(searchResults);

});


app.get("/weather/:string", (req, res) => {
    weather.find({ search: req.params.string, degreeType: 'C' }, function (err, result) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})