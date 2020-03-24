const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const dotenv = require('dotenv')
dotenv.config()
const { APIKEY } = process.env
const PORT = process.env.PORT || 3000

const cron = require('node-cron')
const loadArrayData = require('./src/functions/loadArrayData')

// #### LOAD INITIAL DATA #####
// USA DATA
let UnitedStatesArticleData = ''
const UnitedStatesURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=us&apiKey=${APIKEY}`

loadArrayData(UnitedStatesURL, UnitedStatesArticleData)

// UNITED KINGDOM DATA
let UKArticleData = ''
const GreatBritainURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=gb&apiKey=${APIKEY}`

loadArrayData(GreatBritainURL, UKArticleData)

// ##### LOAD UPDATED DATA #####
// Schedule API call and data refresh at the top of each hour
cron.schedule('0 0 */1 * * * *', () => {
    loadArrayData(UnitedStatesArticleData, UnitedStatesURL)
    .then(console.log('Scheduled UnitedStatesArticles array updated'))
    .catch(error => console.log(error))
})

cron.schedule('00 00 */1 * * * *', () => {
    loadArrayData(UKArticleData, GreatBritainURL)
    .then(console.log('Scheduled UK articles array updated'))
    .catch(error => console.log(error))
})

app.get('/', (req, res)=> {
    res.send({UnitedStatesArticleData, UKArticleData})
})

app.listen(PORT, () => {
    console.log('Article content server running')
})