const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()
const { APIKEY } = process.env
const PORT = process.env.PORT || 3000

const cron = require('node-cron')
const fetch = require('node-fetch')

const today = new Date().toJSON().slice(0,10)
const url = `https://newsapi.org/v2/everything?q=coronavirus&from=${today}&sortBy=popularity&apiKey=${APIKEY}`


let articleData = ''

const getAPIData = async (apiURL) => {
    const response = await fetch(apiURL, {
        method: 'GET',
    })

    return await response.json()
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

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