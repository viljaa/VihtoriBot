import { Message } from 'discord.js'
import Command from '../types/Command'
import fetch from 'node-fetch'
import { OwnedGames, PlayerSummariesPublic } from '../types/SteamAPI'

export const command: Command = {
    name: 'steam',
	description: 'Commands related to Steam.',
    syntax: '!!steam [argument] [argument]',
    arguments: [
        'name - gets steam account name by steamid, pass steamid as second argument',
        'hours - calculates steam account\'s total playtime accross all games, pass steamid as second argument'
    ],
	execute(message: Message, args?: String[]) {
		const apiKey = process.env.STEAM_API_KEY

        if(args?.length) {
            // Get steam account name with SteamID
            if (args[0] === 'name') {
                try {
                    const steamid = args[1]
                    getPlayerSummariesJSON(steamid, apiKey!)
                    .then(json => {
                        const username = json.response.players[0].personaname
                        message.channel.send(`SteamID ${steamid} belongs for a gentleman/gentlewoman named ${username}.`)
                    })
                } catch (err) {
                    console.error(err)
                    message.channel.send('Could not process command, check your command and arguments.')
                }
            }
            // Get total playtime on the account
            if (args[0] === 'hours') {
                try {
                    const steamid = args[1]

                    fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamid}&format=json`)
                    .then(res => res.json())
                    .then(json => {
                        const gameCount = json.response.game_count
                        const totalPlaytime = calculateTotalPlaytime(json)
                        getPlayerSummariesJSON(steamid, apiKey!)
                        .then(json => {
                            const username = json.response.players[0].personaname
                            message.channel.send(`${username} has total of ${totalPlaytime} hours played accross ${gameCount} different games.`)  
                        })
                    })
                } catch (err) {
                    console.error(err)
                    message.channel.send('Could not process command, check your command and arguments.')
                }
            }
        }
    }
}

/* Functions for Steam commands */

function calculateTotalPlaytime(games: OwnedGames): number {
    let playtimeMinutes: number = 0
    games.response.games.forEach(game => {
        playtimeMinutes = playtimeMinutes + game.playtime_forever
    })
    return Math.ceil(playtimeMinutes/60)
}

function getPlayerSummariesJSON(steamid: String, apikey: string): Promise<PlayerSummariesPublic> {
    return fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steamid}`).then(res => res.json())
}