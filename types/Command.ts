import { Message } from 'discord.js'

export default interface Command {
    name: string,
	description: string,
	syntax: string,
	arguments?: string[],
	execute(message: Message, args?: string[]): void
}

export function invalidCommand(message: Message): void {
	message.channel.send('Could not process command, check your command and arguments.')
} 