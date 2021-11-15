const { Telegraf, Markup } = require('telegraf');
const axios = require('axios')
const lookup_table = {
    "png": ["jpg", "gif"],
    "jpg": ["png", "gif"],
    "gif": ["png", "jpg"],
    "HEIC": ["png", "jpg", "gif"]
}
module.exports = {
    replyWith: (ctx, ops) => {
        holder = []
        for (option of lookup_table[ops]) {
            holder.push(Markup.button.callback(option, option))
        }
        return ctx.reply(
            'What do you want to convert to?',
            Markup.inlineKeyboard(holder)
        )
    },
    upload: (api_url, form_data) => {
            axios.post(api_url, form_data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${form_data._boundary}`,
                }
            }).then((res) => {console.log(res.data)}).catch((err) => {console.log(err)})
    },
}