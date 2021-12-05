import { Message, MessageEmbed } from 'discord.js'
import Command, { invalidCommand } from '../types/Command'
import fetch from 'node-fetch'
import { OwnedGames, PlayerSummariesPublic } from '../types/SteamAPI'

export const command: Command = {
    name: 'steam',
	description: 'Commands related to Steam.',
    syntax: '!!steam [argument] [argument]',
    arguments: [
        'name - gets steam account name by steamid, pass steamid as second argument',
        'hours - calculates relevant playtime statistics for the steam account matching the given Steam ID, pass steamid as second argument'
    ],
	execute(message: Message, args?: string[]) {
		const apiKey = process.env.STEAM_API_KEY

        if(args?.length) {
            // Get steam account name with SteamID
            if (args[0] === 'name') {
                const steamid = args[1]
                getPlayerSummariesJSON(steamid, apiKey!)
                .then(json => {
                    if (json.response.players.length < 1) return Promise.reject(`No results with ID ${steamid}.`)
                    else {
                        const username = json.response.players[0].personaname
                        message.channel.send(`SteamID ${steamid} belongs for a gentleman/gentlewoman named ${username}.`)
                    }
                })
                .catch(err => {
                    message.channel.send(`Could not fetch account data for Steam ID ${steamid}. Check the Steam ID and your account privacy settings and try again.`)
                    message.channel.send(`Reason: ${err}`)
                })
            }
            // Get total playtime on the account
            else if (args[0] === 'hours') {
                // Pick steamid from the command arguments
                const steamid = args[1]
                // Fetch owned games for the account
                fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamid}&format=json&include_appinfo=true&include_played_free_games=true`)
                .then(res => {
                    // Check the response validity, handle errors by context
                    if (res.status === 500) return Promise.reject('Invalid Steam ID')
                    // If response is valid, convert it to json
                    return res.json()
                })
                .then(ownedGames => {
                    // Check if any data was received from the Steam Web API
                    if (Object.keys(ownedGames.response).length < 1) return Promise.reject('Account privacy settings are set on private, can\'t fetch the required data.')
                    // Get player summaries to determine username for given steamid
                    getPlayerSummariesJSON(steamid, apiKey!)
                    .then(playerSummaries => {
                        // Prepare data needed for the embedded message
                        const playtimeData = calculatePlaytimeData(ownedGames)
                        // Compose and send the embedded message
                        message.channel.send(embeddedHourData(playtimeData, playerSummaries))  
                    })
                })
                .catch(err => {
                    message.channel.send(`Could not fetch account data for Steam ID ${steamid}. Check the Steam ID and your account privacy settings and try again.`)
                    message.channel.send(`Reason: ${err}`)
                })
            }
            else {
                invalidCommand(message)
            }
        }
    }
}

interface PlaytimeData {
    gameCount: number,
    totalPlaytime: number,
    mostPlayedEver: {
        game: string,
        playtime: number
    },
    mostPlayedRecent: {
        game: string,
        playtime_2_weeks: number
    }[]
}

/* Functions for Steam commands */

function calculatePlaytimeData(games: OwnedGames): PlaytimeData {
    /* Determine most played game of all time and the 3 most played games in the last 2 weeks. Recently most played games are ordered in descending order. */
    const mostPlayed = games.response.games.reduce((mostPlayedGame, nextGame) => (nextGame.playtime_forever > mostPlayedGame.playtime_forever ? nextGame : mostPlayedGame))
    const recentMostPlayed = games.response.games
          .filter(game => game.playtime_2weeks)
          .sort((a, b) => {return b.playtime_2weeks-a.playtime_2weeks})
          .slice(0, 3)
          .map(game => ({ game: game.name, playtime_2_weeks: Math.round(((game.playtime_2weeks) / 60) * 10) / 10 }))
    /* Calculate total time played accross all games */
    let playtimeMinutes: number = 0
    games.response.games.forEach(game => {
        playtimeMinutes = playtimeMinutes + game.playtime_forever
    })
    /* Return calculated data object. */
    return {
        gameCount: games.response.game_count,
        totalPlaytime: Math.ceil(playtimeMinutes / 60),
        mostPlayedEver: {
            game: mostPlayed.name,
            playtime: Math.ceil(mostPlayed.playtime_forever / 60)
        },
        mostPlayedRecent: recentMostPlayed
    }
}

function getPlayerSummariesJSON(steamid: string, apikey: string): Promise<PlayerSummariesPublic> {
    return fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steamid}`).then(res => res.json())
}

function embeddedHourData(gamesData: PlaytimeData, playerSummaries: PlayerSummariesPublic): MessageEmbed {
    const user = playerSummaries.response.players[0]
    /* Generate the embedded message from the gathered data provided in the function parameters. */
    return new MessageEmbed()
    .setColor('#2a475e')
    .setTitle(`${user.personaname}'s playtime on Steam`)
    .addFields(
        { name: 'Total playtime:', value: `${gamesData.totalPlaytime} hours`, inline: true},
        { name: 'Amount of games:', value: gamesData.gameCount, inline: true},
        { name: 'Most played game ever:', value: `${gamesData.mostPlayedEver.game} --- ${gamesData.mostPlayedEver.playtime} hours`},
        {
            name: 'Most played games in the last 2 weeks:', 
            value: `${gamesData.mostPlayedRecent[0].game} --- ${gamesData.mostPlayedRecent[0].playtime_2_weeks} hours\n`
                    +`${gamesData.mostPlayedRecent[1].game} --- ${gamesData.mostPlayedRecent[1].playtime_2_weeks} hours\n`
                    +`${gamesData.mostPlayedRecent[2].game} --- ${gamesData.mostPlayedRecent[2].playtime_2_weeks} hours` 
        },
    )
    .setThumbnail(user.avatar)
}