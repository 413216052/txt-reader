const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const config = require('./config.js').config

const { fileName, reg, coding } = config
let trunks = []
let size = 0
// let reg = /\uB5DA?[\d|\uD2BB|\uB6FE|\uC8FD|\uCBC4|\uCEE5|\uC1F9|\uC6DF|\uB0CB|\uBEC5|\uCAAE]+[\uD5C2|\uBDDA|\uBBD8]\n/g
let catalog = ['序章']
let contents = []
const stream = fs.createReadStream(path.join(__dirname, fileName + '.txt'))

const mkdir = (fileName) => {
    fs.access(fileName, fs.constants.F_OK, err => {
        if (!err) {
            console.log('已经有该小说的目录')
            return
        } else {
            fs.mkdir(fileName, (error) => {
                if (error) {
                    console.log('解析目录出错', error)
                    return
                }
                let catalogMap = {}
                catalog.forEach((x, i) => {
                    // 章节文件 - 目录名 映射
                    let catalogKey = i + '_' + fileName
                    catalogMap[catalogKey] = x

                    fs.writeFile(path.join(__dirname, fileName, catalogKey + '.txt'), contents[i], 'utf-8', (e) => {
                        if (e) {
                            console.log('创建章节出错', e)
                            return
                        }
                    })
                })
                fs.writeFile(path.join(__dirname, fileName, 'a_目录.txt'), JSON.stringify(catalogMap), 'utf-8', (e) => {
                    if (e) {
                        console.log('创建目录出错', e)
                        return
                    }
                })
            })
        }
    })
}


stream.on('data', (trunk) => {
    trunks.push(trunk)
    size += trunk.length
})
stream.on('end', () => {
    let buf = Buffer.concat(trunks, size)
    let str = iconv.decode(buf, coding)
    catalog = catalog.concat(str.match(reg).map(x => x.replace(/[\s|\\|r|n]+/g, '')))
    contents = contents.concat(str.split(reg))
    mkdir(fileName)
})