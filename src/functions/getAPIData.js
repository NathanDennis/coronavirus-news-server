const fetch = require('node-fetch')

const getAPIData = async (apiURL) => {
    const response = await fetch(apiURL, {
        method: 'GET',
    })

    return await response.json()
}

module.exports = getAPIData