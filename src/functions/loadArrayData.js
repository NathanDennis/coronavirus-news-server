const getAPIData = require('./getAPIData')

const loadArrayData = (URLToCall, arrayToUpdate) => {
    getAPIData(URLToCall).then((data) => {
        arrayToUpdate.length = 0
        arrayToUpdate = data.articles
    }).catch(error => console.log(error))
}

module.exports = loadArrayData