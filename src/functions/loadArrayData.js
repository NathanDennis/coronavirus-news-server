const getAPIData = require('./getAPIData')

const loadArrayData = async (URLToCall, arrayToUpdate) => {
    await getAPIData(URLToCall).then((data) => {
        arrayToUpdate.length = 0
        arrayToUpdate = data.articles
    }).catch(error => console.log(error))
}

module.exports = loadArrayData