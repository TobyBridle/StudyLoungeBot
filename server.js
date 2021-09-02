const fs = require('fs')

const { Client, Intents, Role } = require('discord.js')

const botIntentList = new Intents()
botIntentList.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
    )

const client = new Client({ intents: botIntentList })
const commands = require('./scripts/commands.js');
const Roles = {}


// Load TOKEN and Prefix

var TOKEN = ''
var BOT_PREFIX = ''

const getValues = (path) => {
    fileData = JSON.parse(fs.readFileSync(`${path}values.json`));
    
    TOKEN = fileData['TOKEN']
    BOT_PREFIX = fileData['BOT_PREFIX']
    
    return
}

getValues('./')


const changeEnvInfo = (row, data) => {
    const fileData = JSON.parse(fs.readFileSync('./values.json'))
    if(fileData[row])
    {
        fileData[row] = data
        fs.writeFileSync('./values.json', JSON.stringify(fileData)) // Rewrite data
        // Re read
        getValues('./')
    }
    return
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
        let [command, args] = message.content.slice(1, message.content.length).split(' ')

        // Bundle PREFIX with Message - easier to access on `commands.js`
        message['__BOT_PREFIX'] = BOT_PREFIX

        // If the command is valid, run the function and pass the message, arguments and roles for the server
        if(commands[command]) (commands[command](message, args, Roles[message.member.guild.id]))
    }
})

client.login(TOKEN)

exports.getValues = function(){
    console.log('Hello')
}
exports.changeEnvInfo = changeEnvInfo