export interface OwnedGames {
    response: {
        game_count: number,
        games: [
            {
                appid: number,
                name: string,
                playtime_forever: number,
                playtime_windows_forever: number,
                playtime_mac_forever: number,
                playtime_linux_forever: number,
                playtime_2weeks: number,
            }
        ]
    }
}

export interface PlayerSummariesPublic {
    response: {
        players: [
            {
                steamid: string,
                personaname: string,
                profileurl: string,
                avatar: string,
                avatarmedium: string,
                avatarfull: string,
                avatarhash: string,
                personastate: number,
                primaryclanid: string,
                timecreated: number,
                personastateflags: number,
                loccountrycode: string
            }
        ]
    }
}