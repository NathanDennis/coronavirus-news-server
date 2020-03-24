const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const dotenv = require('dotenv')
dotenv.config()
const { APIKEY } = process.env
const PORT = process.env.PORT || 3000

const cron = require('node-cron')
const fetch = require('node-fetch')

const getAPIData = async (apiURL) => {
    const response = await fetch(apiURL, {
        method: 'GET',
    })

    return await response.json()
}

// USA DATA
let UnitedStatesArticleData = ''
const UnitedStatesURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=us&apiKey=${APIKEY}`

// UNITED KINGDOM DATA
let UKArticleData = ''
const GreatBritainURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=gb&apiKey=${APIKEY}`

// Load initial article data
getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('Initial USA data loaded')
    }).then(getAPIData(GreatBritainURL))
        .then((data) => {
        UKArticleData.length = 0
        UKArticleData = data.articles
        console.log('Initial UK data loaded')
}).catch(error => console.log(error))

// Schedule API call and data refresh every 59th minute of each hour
cron.schedule('0 /0 * * * *', () => {
    getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('USA data loaded')
    }).then(getAPIData(GreatBritainURL))
        .then((data) => {
        UKArticleData.length = 0
        UKArticleData = data.articles
        console.log('UK data loaded')
    }).catch(error => console.log(error))
})


// getAPIData(GreatBritainURL).then((data) => {
//     UKArticleData.length = 0
//     UKArticleData = data.articles
// }).catch(error => console.log(error))

// cron.schedule('* 1 * * * *', () => {
//     getAPIData(GreatBritainURL).then((data) => {
//         UKArticleData.length = 0
//         UKArticleData = data
//     })
// })


app.get('/', (req, res)=> {
    res.send({UnitedStatesArticleData, UKArticleData})
})

app.listen(PORT, () => {
    console.log('Article content server running')
})