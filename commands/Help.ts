import { Message } from 'discord.js'
import Command from '../types/Command'

export const command: Command = {
    name: 'help',
	description: 'Command for getting help on commands.',
    syntax: '!!help [commandname]',
    arguments: ['[commandname] - name of the command you want help for'],
	execute(message: Message, args?: String[]) {
        // If user is trying to get help on a single argument
        if(args?.length) {
            try {
                const filename = args[0].charAt(0).toUpperCase() + args[0].slice(1)
                const { command } = require(`../commands/${filename}`)
                let argumentMessage = `Description for command - !!${args[0]}: ${command.description}\n\nSyntax: ${command.syntax}\n\n`
                if(command.arguments) {
                    argumentMessage = argumentMessage.concat('Arguments:\n')
                    // Generate argument segment
                    for(const i in command.arguments) {
                        argumentMessage = argumentMessage.concat(`${command.arguments[i]}\n\n`)
                    }
                }
                message.channel.send(argumentMessage)
            }
            catch {
                message.channel.send('Sorry, can\'t find that command. Check the spelling and try again.')
            }
        }
        // If no arguments are provided, provide the link to the command documentation
        else {
            const docsLink = 'https://github.com/viljaa/VihtoriBot/blob/master/readme.md'
            message.channel.send(`Link to the Vihtori-Bot command documentation: ${docsLink}`)
            message.channel.send('For more info about single command, try !!help [commandname] e.g. !!help help.')
        }
	},
}