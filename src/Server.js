const express = require('express');
const { Telegraf } = require('telegraf');
const app = express()
const port = 4000;

app.get('/', (req,res) => {
    res.send("Test!")
    let app = new Telegraf(process.env.API_TOKEN)

    app.telegram.sendMessage("673496860", "sent")
})

app.listen(port, () => {
    console.log("express!")
})


module.exports = app
