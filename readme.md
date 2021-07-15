# Vihtori Bot
Vihtori bot is a Discord bot implementation for Vihtori E-Sports Discord-server created with Discord.js and Typescript.

## Documentation

## Basic structure of commands

Every command starts with the prefix `!!` followed by command and additional arguments for the specified command. All arguments are optional and command specific, but some command features might require the use of arguments in order to work. Example command would follow the following pattern:

```
Structure:  !![command] [argument] [argument]
Example:    !!steam hours 76561198082257196
```

### List of currently supported commands
Currently supported base commands for Vihtori-Bot, check command specific arguments for more in depth information about arguments of the different commands.
| Command | Arguments | Description |
| --- | --- | --- |
| gamingnews | [source, e.g. pelaaja], activate, stop | Command for managing scheduled gamingnews fetching service, that fetches articles from different gaming news outlets on the web.|
| greet | - | Vihtori-Bot greets the user with proper Vihtori enthusiasm! |
| steam | name, hours | Command for SteamWebAPI related functionalities. |

### Command specific arguments
Command specific argument descriptions for different commands, which have arguments tied to the command logic. Brackets surrounding an argument mean it's a variable argument,
which can change depending on the context of the command. For example arguments of the command <b>!!gamingnews</b> vary by source as following:

```
/* Source is Pelaaja.fi */
!!gamingnews pelaaja activate

/* Source is IGN */
!!gamingnews ign activate
```

<b>!!steam</b>
| Argument | Additional arguments | Description |
| --- | --- | --- |
| hours | [steamid]: e.g. 7656119808225719 | Calculates the total amount of hours a steam account has accross all owned games on the account.|
| name | [steamid]: e.g. 76561198082257196 | Fetches Steam account username for the provided steamid from SteamWebAPI. |

<b>!!gamingnews</b>
| Argument | Additional arguments | Description |
| --- | --- | --- |
| set | [channel]: e.g. #general | Sets the output channel for the news posts. Output channel must be a text channel. |
| [source]: e.g. pelaaja | activate, stop | Starts and stops gamingnews service for specific news source. Source defines which news source is managed and the process is started and stopped by adding either activate or stop as additional argument after source. |
