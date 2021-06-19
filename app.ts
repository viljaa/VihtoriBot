/* Imports */
import Bot from './classes/bot-core'

/* Bot configuration */
const bot: Bot = new Bot

/* Run the bot */
bot.activate().then(()=> {
    console.log('Succesfully logged in, Vihtori Bot is active!')
}).catch(error => {
    console.log(error)
})