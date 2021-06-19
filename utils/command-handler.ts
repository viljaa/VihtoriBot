/* Imports */
import { Message } from 'discord.js'

/* Function for providing different fucntionality based on commands received */
export function commandHandler(message: Message): void {
    // Remove prefix from the command and initialize variable with the value
    const command: string = message.content.slice(2)
    
    /* Example command, Vihtori greeter! */
    if (command === 'greet') {
        const user = message.member?.displayName
        message.channel.send('Hello, ' + user + '! May Vihtori be victorious!')
    }
}