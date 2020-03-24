const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const dotenv = require('dotenv')
dotenv.config()
const { APIKEY } = process.env
const PORT = process.env.PORT || 3000

const cron = require('node-cron')
const getAPIData = require('./src/functions/getAPIData')

// #### LOAD INITIAL DATA #####
// USA DATA
let UnitedStatesArticleData = ''
const UnitedStatesURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=us&apiKey=${APIKEY}`

getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('Initial USA data loaded')
    })
    .catch(error => console.log(error))

// UNITED KINGDOM DATA
let UKArticleData = ''
const GreatBritainURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=gb&apiKey=${APIKEY}`

getAPIData(GreatBritainURL)
    .then((data) => {
        UKArticleData.length = 0
        UKArticleData = data.articles
        console.log('Initial UK data loaded')
    })
    .catch(error => console.log(error))


// ##### LOAD UPDATED DATA #####
// Schedule API call and data refresh at the top of each hour
cron.schedule('0 0 */1 * * * *', () => {
    getAPIData(UnitedStatesURL)
    .then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data.articles
        console.log('Scheduled USA data loaded')
    })
    .catch(error => console.log(error))
})

cron.schedule('00 00 */1 * * * *', () => {
    getAPIData(GreatBritainURL)
    .then((data) => {
        UKArticleData.length = 0
        UKArticleData = data.articles
        console.log('Scheduled UK data loaded')
    })
    .catch(error => console.log(error))
})

app.get('/', (req, res)=> {
    res.send({UnitedStatesArticleData, UKArticleData})
})

app.listen(PORT, () => {
    console.log('Article content server running')
})