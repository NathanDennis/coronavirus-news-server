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

// Load initial article data
getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('Initial USA data loaded')
    }).catch(error => console.log(error))

// Schedule API call and data refresh every 59th minute of each hour
cron.schedule('00 00 */1 * * * *', () => {
    getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('Scheduled USA data loaded')
    }).catch(error => console.log(error))
})

// UNITED KINGDOM DATA
let UKArticleData = ''
const GreatBritainURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=gb&apiKey=${APIKEY}`

getAPIData(GreatBritainURL).then((data) => {
    UKArticleData.length = 0
    UKArticleData = data.articles
    console.log('Initial GB data loaded')
}).catch(error => console.log(error))

cron.schedule('00 00 */1 * * * *', () => {
    getAPIData(GreatBritainURL).then((data) => {
        UKArticleData.length = 0
        UKArticleData = data
        console.log('Scheduled GB data loaded')
    })
})


app.get('/', (req, res)=> {
    res.send({UnitedStatesArticleData, UKArticleData})
})

app.listen(PORT, () => {
    console.log('Article content server running')
})