import { Message } from 'discord.js'
import Command from '../types/Command'

export const command: Command = {
    name: 'help',
	description: 'Command for getting help on commands.',
	execute(message: Message, args?: String[]) {
        const docsLink = 'https://github.com/viljaa/VihtoriBot/blob/master/readme.md'
        message.channel.send(`Link to the Vihtori-Bot command documentation: ${docsLink}`)
	},
}