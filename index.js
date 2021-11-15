const FormData = require('form-data');
const { Telegraf } = require('telegraf')
const axios = require('axios');
const { 
    uniqueNamesGenerator, 
    adjectives, 
    colors, 
    animals 
} = require('unique-names-generator');

const reply = require('./src/Reply')
const query = require('./src/Query');

require("dotenv").config()

const bot = new Telegraf(process.env.API_TOKEN)

bot.on('document', async (ctx) => {
    const {file_id: fileId} = ctx.update.message.document;

    // get the file link
    ctx.telegram.getFileLink(fileId).then((link) => {
        // download the strem with file linke
        axios.get(link['href'], {responseType: 'stream'}).then((file) => {
            let data = new FormData();
            let ext = link['pathname'].split('.').pop()
            // ask what file format to go to and upload to s3
            reply.replyWith(ctx, ext.toString().trim()).then(() => {
                let filename = `${uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })}.${ext}`;
                let api_url = `${process.env.HOST}?Bucket=${process.env.BUCKET}&Key=test/${filename}`
                data.append('media', file.data, filename);

                query.filename = filename
                query.FormData = data
                query.api_url = api_url
            })
        })
    })
})

// this callback will be used to send query over to matts stuff or main controller
bot.on('callback_query', (ctx) => {
    // Explicit usage
    reply.upload(query.api_url, query.FormData)

    // Using context shortcut
    ctx.answerCbQuery()
  })
bot.launch()