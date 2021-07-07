import { Message } from 'discord.js'
import Command from '../types/Command'

export const command: Command = {
    name: 'greet',
	description: 'What kind of bot would Vihtori-Bot be if it didn\'t say hello back?',
	execute(message: Message, args?: String[]) {
		const user = message.member?.displayName
        message.channel.send('Hello, ' + user + '! May Vihtori be victorious!')
	},
}