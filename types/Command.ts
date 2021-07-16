import { Message } from 'discord.js'

export default interface Command {
    name: string,
	description: string,
	syntax: string,
	arguments?: string[],
	execute(message: Message, args?: string[]): void
}