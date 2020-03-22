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

getAPIData(UnitedStatesURL).then((data) => {
    UnitedStatesArticleData.length = 0
    UnitedStatesArticleData = data.articles
}).catch(error => console.log(error))

cron.schedule('* 0 * * * *', () => {
    getAPIData(UnitedStatesURL).then((data) => {
        UnitedStatesArticleData.length = 0
        UnitedStatesArticleData = data
    })
})

// UNITED KINGDOM DATA
let UKArticleData = ''
const GreatBritainURL = `http://newsapi.org/v2/top-headlines?q=coronavirus&country=gb&apiKey=${APIKEY}`
getAPIData(GreatBritainURL).then((data) => {
    UKArticleData.length = 0
    UKArticleData = data.articles
}).catch(error => console.log(error))

cron.schedule('* 1 * * * *', () => {
    getAPIData(GreatBritainURL).then((data) => {
        UKArticleData.length = 0
        UKArticleData = data
    })
})


app.get('/', (req, res)=> {
    res.send({UnitedStatesArticleData, UKArticleData})
})

app.listen(PORT, () => {
    console.log('Article content server running')
})