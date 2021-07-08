/* Imports */
import { Client, Collection } from 'discord.js'
import * as dotenv from 'dotenv'
import fs from 'fs'
import Command from '../types/Command'

/* Import configuration */
dotenv.config()

/* Bot configuration */
export default class Bot {
    /* Create client instance */
    private client: Client = new Client
    /* Token for authenticating the Discord bot */
    private token?: string = process.env.BOT_TOKEN
    /* Define command prefix for identifying commands from other messages */
    private prefix = '!!'
    /* Command collection for storing all of the bots commands */
    private commandCollection: Collection<string, Command> = new Collection()
    /* Fetch all command names into an array to require commands individually. */
    private commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'))

    /* Funciton for initializing commands defined in single files under the ./commands directory */
    initializeCommands(fileArray: String[]): void {
        /* Loop through commands and add them to the command collection */
        fileArray.forEach(filename => {
            const { command } = require(`../commands/${filename.slice(0, -3)}`)
            this.commandCollection.set(command.name, command)
        })
    }

    /* Function that runs the bot and activates it to receive commands */
    activate(): Promise <string> {
        this.initializeCommands(this.commandFiles)
        /* Listen for incoming commands, execute commands by refering to command name */
        this.client.on('message', message => {
            if (!message.content.startsWith(this.prefix) || message.author.bot) return
            const args: string[] = message.content.slice(2).split(' ')
            const command: string = args[0]
            args.shift()

            try {
                this.commandCollection.get(command)?.execute(message, args)
            }
            catch(err){
                console.log(err)
            }
        })

        return this.client.login(this.token)
    }
}