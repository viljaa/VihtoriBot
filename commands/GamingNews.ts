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
        
        /* Evaluate arguments for configuring the job. Command structure: !!gamingnews [action] [source] */
		if(args?.length){
            /* Options for starting the news service. */
            if(args[0] === 'activate') {
                if(args[1] === 'pelaaja') {
                    scrapePelaaja.start()
                    message.channel.send('Roger that gamer, news from Pelaaja.fi incoming every hour!')
                }
            }
            /* Options for stopping the news service. */
            if(args[0] === 'stop') {
                if(args[1] === 'pelaaja') {
                    scrapePelaaja.stop()
                }
                message.channel.send(`The game news service for ${args[1]} is now off.`)
            }
        }
	},
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
        const articleUrl = textelement.attr('href')

        // Scarape image related data
        const articleImgUrl = $('.view-content>.views-row>.layout-title-box>.title-box-background>a>img').first().attr('src')

        // Create embedded message
        const formattedMsg = new MessageEmbed()
        .setColor('#7400b8')
        .setTitle(`Pelaaja: ${scoop}`)
        .setURL(`https://pelaaja.fi${articleUrl}`)
        .setAuthor('Vihtori-Bot News')
        .setImage(articleImgUrl!)
        .setTimestamp()

        commandMsg.channel.send(formattedMsg)
        console.log('Article from Pelaaja.fi fetched.')
    })
})