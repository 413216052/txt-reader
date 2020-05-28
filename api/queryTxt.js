// 查询章节

const fs = require('fs')
const path = require('path')
const config = require('../config.js').config

const { fileName } = config

const query = (body, callback, errBack) => {
    fs.readFile(path.join(path.resolve(__dirname, '..'), fileName, body.name + '.txt'), 'utf-8', (err, data) => {
        if (body.name === 'a_目录') data = JSON.parse(data)
        let answer = {
            status: 200,
            body: {
                data: data,
                msg: 'success'
            }
        }
        if (err) {
            errBack && errBack(err)
            return
        }
        callback && callback(answer)
    })
}

module.exports = query