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

const today = new Date().toJSON().slice(0,10)
const url = `https://newsapi.org/v2/everything?q=coronavirus&from=${today}&pageSize=50&sortBy=popularity&apiKey=${APIKEY}`


let articleData = ''

const getAPIData = async (apiURL) => {
    const response = await fetch(apiURL, {
        method: 'GET',
    })

    return await response.json()
}

getAPIData(url).then((data) => {
    articleData.length = 0
    articleData = data.articles
}).catch(error => console.log(error))

cron.schedule('* 0 * * * *', () => {
    getAPIData().then((data) => {
        articleData.length = 0
        articleData = data
    })
})

app.get('/', (req, res)=> {
    res.send(articleData)
})

app.listen(PORT, () => {
    console.log('Article content server running')
})