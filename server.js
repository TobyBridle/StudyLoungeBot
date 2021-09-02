require('dotenv').config()
const { TOKEN, BOT_PREFIX } = process.env
const fs = require('fs')
const { exec } = require("child_process");

const { Client, Intents, Collection, Role } = require('discord.js')
const botIntentList = new Intents()
botIntentList.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
    )
const client = new Client({ intents: botIntentList })
const commands = require('./scripts/commands.js');
const Roles = {}
const changeEnvInfo = (row, data) => {
    envData = fs.readFileSync('./.env').toString().trim().split('\n')
    tmp = ''
    
    for ( const [index, line] of envData.entries())
    {
        line.split(' = ')[0] === row ? tmp += `${row} = ${data}\n` : tmp += `${line}\n`
    }

    fs.writeFileSync('./.env', tmp.toString())
    console.log('Changed a value in .env')
    process.exit(1) // Using Forever module the server will restart
}

client.once('ready', (c) => {
    
    c.guilds.cache.find(g => {
        Roles[`${g.id}`] = []
        g.roles.cache.find(r => {
            Roles[`${g.id}`].push({
                role: r
            })
        })
    })

    console.log('Woohoo! I\'m up and running!')
    
})

client.on('messageCreate', (message) => {
    if (message.content.startsWith(BOT_PREFIX))
    {
        // Get Command
     
        let [command, args]= message.content.slice(1, message.content.length).split(' ')
        commands[command] ? (commands[command](message, args, Roles[message.member.guild.id])) : ''
    }
})

client.login(TOKEN)

exports.changeEnvInfo = changeEnvInfo