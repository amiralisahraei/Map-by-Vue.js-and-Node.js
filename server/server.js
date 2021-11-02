const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    next()
})

var features = [

    // tehran
    {
        x: 51.4167,
        y: 35.7,
        icon: "windmill-15",
        description: "<h4>Tehran :</h4><p>wind speed : 7 km/h</p>",
    },
    // mashhad
    {
        x: 59.6042,
        y: 36.3069,
        icon: "windmill-15",
        description: "<h4>Mashhad :</h4><p>wind speed : 14 km/h</p>",
    },
    // esfahan
    { x: 51.680374, y: 32.661343, icon: "windmill-15", description: "<h4>Esfahan :</h4><p>wind speed : 8 km/h</p>" },
    // tabriz
    { x: 46.2833, y: 38.0833, icon: "windmill-15", description: "<h4>Tabriz :</h4><p>wind speed : 10 km/h</p>" },
    // qom
    { x: 50.8789, y: 34.6461, icon: "windmill-15", description: "<h4>Qom :</h4><p>wind speed : 17 km/h</p>" },
    // ahvaz
    { x: 48.6692, y: 31.3203, icon: "windmill-15", description: "<h4>Ahvaz :</h4><p>wind speed : 13 km/h</p>" },
    // Kerman
    { x: 57.0667, y: 30.2833, icon: "windmill-15", description: "<h4>Kerman :</h4><p>wind speed : 5 km/h</p>" },
    // Zahedan
    { x: 60.8629, y: 29.4963, icon: "windmill-15", description: "<h4>Zahedan :</h4><p>wind speed : 12 km/h</p>" }
    
]

app.get('/data', (req, res, next) => {
    res.json(features)
})

app.listen(3000, () => {
    console.log("server is run on port 3000")
})