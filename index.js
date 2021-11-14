const FormData = require('form-data');
const { Telegraf, Markup } = require('telegraf')
const axios = require('axios');
const fs = require('fs')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


require("dotenv").config()

const bot = new Telegraf(process.env.API_TOKEN)

bot.command('random', (ctx) => {
    return ctx.reply(
        'random example',
        Markup.inlineKeyboard([
          Markup.button.callback('Coke', 'Coke'),
          Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
          Markup.button.callback('Pepsi', 'Pepsi')
        ])
      )
})
bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Coke', 'Coke'),
        Markup.button.callback('Pepsi', 'Pepsi')
      ])
    })
  })


  bot.command('simple', (ctx) => {
    return ctx.replyWithHTML(
      '<b>Coke</b> or <i>Pepsi?</i>',
      Markup.keyboard(['Coke', 'Pepsi'])
    )
  })

bot.on('document', async (ctx) => {
    const {file_id: fileId} = ctx.update.message.document;

    ctx.telegram.getFileLink(fileId).then((link) => {
        axios.get(link['href'], {responseType: 'stream'}).then((file) => {
            let data = new FormData();
            let ext = link['pathname'].split('.').pop()
            let filename = `${uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })}.${ext}`;
            let api_url = `${process.env.HOST}?Bucket=${process.env.BUCKET}&Key=test/${filename}`
            data.append('media', file.data, filename);

            axios.post(api_url, data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            }).then((res) => {console.log(res.data)}).catch((err) => {console.log(err)})
        })
    })
})
bot.launch()
