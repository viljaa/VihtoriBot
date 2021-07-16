/* Imports */
import { Client, Collection, Message } from 'discord.js'
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
            const command: Command | undefined = this.commandCollection.get(args[0])
            args.shift()

            command ? command.execute(message, args) : this.commandNotFound(message)
        })

        return this.client.login(this.token)
    }
    
    private commandNotFound(message: Message): void {
        const docsUrl = 'https://github.com/viljaa/VihtoriBot/blob/master/readme.md'
        message.channel.send(`I\'m sorry, I couldn\'t find that command from my vast vocabulary. See the Vihtori-Bot command documentation for available commands: ${docsUrl}`)
        message.channel.send('For more info about single command, try !!help [commandname] e.g. !!help help.')
    }
}