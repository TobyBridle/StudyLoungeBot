const fs = require('fs')

const { Client, Intents, Role, Collection } = require('discord.js')

const botIntentList = new Intents()
botIntentList.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
    )

const client = new Client({ intents: botIntentList })
const commands = new Collection();
const commandsDirectory = fs.readdirSync('./scripts').filter(file => file.endsWith('.js'))

commandsDirectory.forEach(commandFile => {
    // Assuming each File inside the directory is a Bot Command
    const command = require(`./scripts/${commandFile}`);
    commands.set(command.name, command);
});

// Load TOKEN and Prefix
const {TOKEN, BOT_PREFIX} = require("./values.json")


client.once('ready', (c) => {

    console.log('Woohoo! I\'m up and running!')
    client.user.setActivity(`Managing ${client.guilds.cache.size} Servers! Need help?\nTry: \`${BOT_PREFIX}help\``)
    
})

client.on('messageCreate', (message) => {
    if (message.content.startsWith(BOT_PREFIX) && !message.author.bot)
    {
        // Get Command
        const userCommand = message.content.slice(BOT_PREFIX.length, message.content.length).split(' ')
        const command = userCommand[0].toLowerCase()
        const args = userCommand.slice(1)
        
        if(command === ('help' || 'info'))
        {
            if(args.length && commands.get(args[0]))
            {
                c = commands.get(args[0])
                message.reply(`\`${c.name}\` - \`${c.description}\` (usage: \`${c.usage}\`)`)
            }
            messageResponse = 'List of Commands:\n\n'
            commands.forEach(c => {
                messageResponse += ` \`${c.name}\` - \`${c.description}\` (usage: \`${c.usage}\`)\n\n`
            })

            console.log(messageResponse)

            message.reply(messageResponse)
        }
            // Check all Permissions
        const c = commands.get(command) || commands.find(commandAlias => commandAlias.alias.includes(command))

        if(c)
        {
            if (c.arguments && !args.length) // Check if the Right amount of Arguments are passed!
            {
                message.reply('Sorry, but arguments are needed to run that command!\nCorrect usage: ' + `\`${BOT_PREFIX}${command} ${c.usage}\``)
                return
            }

            if (c.guildOnly && message.channel.type == 'dm') // Check if Command is Guild Only
            {
                message.reply('Sorry, this command can only be run in Servers!')
                return
            }

            if (c.permissions)
            {
                if(!message.member.permissions.has(c.permissions))
                {
                    message.reply('You do not have the valid permissions! Permissions needed are:\n' + c.permissions)
                }
            }


            // CAN RUN THE COMMAND

            try {
                c.execute(message, args)
            } catch (error) {
                console.error(error)
                message.reply('Sorry, something went wrong with the command!')
            }


        }
    }
})

client.login(TOKEN)
