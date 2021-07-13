import { Message, MessageEmbed } from 'discord.js'
import Command from '../types/Command'
import { CronJob } from 'cron'
import cheerio from 'cheerio'
import fetch from 'node-fetch'

let commandMsg: Message

export const command: Command = {
    name: 'gamingnews',
    description: 'Gaming articles scraped from different news sources.',
    execute(message: Message, args?: String[]) {
        /* Store the message in a variable, so that it can be used by cron jobs that use Discord.js methods. */
        commandMsg = message
        
        /* Evaluate arguments for configuring the job. Command structure: !!gamingnews [source] [action] */
		if(args?.length){
            switch (args[0]) {
                case 'pelaaja': {
                    switch (args[1]) {
                        case 'activate': {
                            scrapePelaaja.start()
                            message.channel.send('Roger that gamer, news from Pelaaja.fi incoming every hour!')
                            break
                        }
                        case 'stop': {
                            scrapePelaaja.stop()
                            break
                        }
                    }
                    break
                }
                case 'ign': {
                    switch (args[1]) {
                        case 'activate': {
                            scrapeIgn.start()
                            message.channel.send('Daring aren\'t we, news from IGN incoming every hour!')
                            break
                        }
                        case 'stop': {
                            scrapeIgn.stop()
                            break
                        }
                    }
                    break
                }
                case 'rps': {
                    switch (args[1]) {
                        case 'activate': {
                            scrapeRPS.start()
                            message.channel.send('I see you\'re a gamer of culture as well, news from RockPaperShotgun incoming every hour!')
                            break
                        }
                        case 'stop': {
                            scrapeRPS.stop()
                            break
                        }
                    }
                    break
                }
            }
            /* Confditional message for stopping the service, shared by all sources. */
            if(args[1] === 'stop') message.channel.send(`The game news service for ${args[0]} is now off.`)
        }
	}
}

/* Function for generating embedded news post message */
function generateEmbeddedMessage(sourceName: string, scoop: string, articleUrl?: string, articleImgUrl?: string): MessageEmbed {
    return new MessageEmbed()
    .setColor('#7400b8')
    .setTitle(`${sourceName}: ${scoop}`)
    .setURL(articleUrl ? articleUrl: '')
    .setAuthor('Vihtori-Bot News')
    .setImage(articleImgUrl ? articleImgUrl : '')
    .setTimestamp()
}

/* GameingNews cron-job configuration. */

/* All jobs must be defined outside of command scope, so that a new instance of the job
isn't created every time execute() -function is fired and cron jobs can keep track
of the job instance. This is crucial to be able to stop a started job. */

// Job for scraping and posting newest article from Pelaaja.fi
const scrapePelaaja: CronJob = new CronJob('0 0 */1 * * *', () => {
    fetch('https://pelaaja.fi/')
    .then(res => res.text())
    .then(body => {
        const $ = cheerio.load(body)

        // Scrape text related data
        const textelement = $('.view-content>.views-row>.layout-title-box>.title-box-text>h4>a').first()
        const scoop = textelement.text()
        const articleUrl = `https://pelaaja.fi${textelement.attr('href')}`

        // Scarape image related data
        const articleImgUrl = $('.view-content>.views-row>.layout-title-box>.title-box-background>a>img').first().attr('src')

        // Create embedded message
        commandMsg.channel.send(generateEmbeddedMessage('Pelaaja.fi', scoop, articleUrl, articleImgUrl))
    })
})

const scrapeIgn: CronJob = new CronJob('0 19 */1 * * *', () => {
    fetch('https://nordic.ign.com/article/news')
    .then(res => res.text())
    .then(body => {
        const $ = cheerio.load(body)

        // Scrape text related data
        const scoop = $('article>.m>h3>a').first().text()
        const articleUrl = $('article>.m>h3>a').first().attr('href')

        // Scrape image related data
        const articleImgUrl = $('article>.t>a>img').first().attr('src')

        //Create embedded message
        commandMsg.channel.send(generateEmbeddedMessage('IGN', scoop, articleUrl, articleImgUrl))
    })
})

const scrapeRPS: CronJob = new CronJob('0 39 */1 * * *', () => {
    fetch('https://www.rockpapershotgun.com/news')
    .then(res => res.text())
    .then(body => {
        const $ = cheerio.load(body)

        // Scrape text related data
        const scoop = $('.summary_list>li>article>a').first().attr('title')
        const articleUrl = $('.summary_list>li>article>a').first().attr('href')

        // Scrape image related data
        const articleImgUrl = $('.summary_list>li>article>.thumbnail>img').first().attr('src')

        //Create embedded message
        commandMsg.channel.send(generateEmbeddedMessage('RockPaperShotgun', scoop!, articleUrl, articleImgUrl))
    })
})