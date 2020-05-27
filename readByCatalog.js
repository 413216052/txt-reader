const fs = require('fs')
const path = require('path')
const config = require('./config.js').config

const { fileName } = config

fs.readFile(path.join(__dirname, fileName, '2_' + fileName + '.txt'), 'utf-8', (err, data) => {
    console.log(data)
})