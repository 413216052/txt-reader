
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()

// CORS & Preflight request
app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.includes('.')) {
        res.set({
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': req.headers.origin || '*',
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Content-Type': 'application/json; charset=utf-8'
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

// cookie parser
app.use((req, res, next) => {
    req.cookies = {}, (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
        let crack = pair.indexOf('=')
        if (crack < 1 || crack == pair.length - 1) return
        req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(pair.slice(crack + 1)).trim()
    })
    next()
})

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use('/', (req, res, next) => {
//     console.log(req.originalUrl, req.query, req.body)
//     next()
// })

fs.readdirSync(path.join(__dirname, 'api')).reverse().forEach(file => {
    if (!file.endsWith('.js')) return
    let route = '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
    let question = require(path.join(__dirname, 'api', file))

    app.use(route, (req, res) => {
        let body = Object.assign({}, req.query, req.body, { cookie: req.cookies })
        question(body, (answer) => {
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            // res.append('Set-Cookie', answer.cookie)
            res.status(answer.status).send(answer.body)
        }, (err) => {
            console.log('[ERR]', decodeURIComponent(req.originalUrl))
            res.status(500).send(err)
        })
    })
})

const port = process.env.PORT || 3000
const host = process.env.HOST || ''

app.server = app.listen(port, host, () => {
    console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
})


module.exports = app