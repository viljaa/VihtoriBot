/* Imports */
import { Client, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import { commandHandler } from '../utils/command-handler'

/* Import configuration */
dotenv.config()

/* Bot configuration */
export default class Bot {
    private token?: string = process.env.BOT_TOKEN
    private client: Client = new Client
    private prefix = '!!'

    /* Function that runs the bot and activates it to receive commands */
    activate(): Promise <string> {

        /* Command handler for incoming commands */
        this.client.on('message', message => {
            if(message.content.startsWith(this.prefix)) commandHandler(message)
        })

        return this.client.login(this.token)
    }
}