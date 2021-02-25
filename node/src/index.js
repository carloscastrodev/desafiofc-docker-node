const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const mysql = require('mysql')
const initTableSql = "CREATE TABLE IF NOT EXISTS people (name VARCHAR(255))";
const connection = mysql.createConnection(config)
connection.query(initTableSql)
connection.end()

const names = ['Carlos', 'João', 'Matheus', 'Lucas', 'Tiago']

const addName = async () => {
    try {
        const connection = mysql.createConnection(config)
        const sql = `INSERT INTO people(name) values('${names[Math.floor(Math.random()*5)]}')`
        await new Promise((resolve, reject) => connection.query(sql, (err, result, fields) => {
            if (err) reject(err)
            resolve(result)
        }))
        connection.end()
    } catch (err) {
        console.log(err)
    }
    
}

const getNames = async () => {
    let names = null
    const connection = mysql.createConnection(config)
    const sql = `SELECT * FROM people`
    const promise = new Promise((resolve, reject) => connection.query(sql, (err, result, fields) => {
        if (err) reject(err)
        resolve(result)
    }))
    connection.end()
    names = await promise
    return names
}

const template = (selection) => {
  let s = '<h1>Full Cycle</h1>'
  s += '<ul>'
  selection.forEach(row => s += `<li>${row.name}</li>`)
  s += '</ul>'
  return s
}

app.get('/', async (req,res) => {
    await addName()
    const names = await getNames()
    const html = template(names)
    res.send(html)
})

app.listen(port, '0.0.0.0', ()=> {
    console.log('Rodando na porta ' + port)
})