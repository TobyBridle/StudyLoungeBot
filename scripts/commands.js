const serverCommands = require('../server.js');
const Discord = require('discord.js')
const fs = require('fs');
const path = require('path');

const CHANNELS = {
    'stopStudyChannel': '882783531531653210'
}

exports.help = (message, args) => {
    const commandsInfo = {
        'help': `Prints a list of all available commands. Pass an argument to print the specific command info (e.g ${message['__BOT_PREFIX']}help study)\n`,
        'delete': `Deletes messages from the channel. Pass an argument to specify the amount of messages to delete (e.g ${message['__BOT_PREFIX']}delete 50)\n`,
        'study': 'Prevents user from seeing any channels unrelated to study-help. Does not end until the stop command is used.\n',
        'stop': 'Ends the user\'s study session\n',
        'set': 'Allows server administrators to modify variables such as the bot prefix'
    }

    botReply = '' // String that will be sent back to user

    if(args[0] && commandsInfo[args[0]]){
        message.reply(`\`${message['__BOT_PREFIX']}${args[0]}\` - ${commandsInfo[args[0]]}`)
        return
    }

    Object.keys(commandsInfo).forEach(command => {
        botReply += `\`${message['__BOT_PREFIX']}${command}\` - ${commandsInfo[command]}`
    })

    message.reply(botReply)
}

exports.delete = (message, args, guildRoles) => {
    
    if(!typeof(args[0], 'int') || args[0] <= 0)
    {
        message.reply('Enter a valid Integer value for the argument!').then(msg => {
            setTimeout( () => msg.delete, 2000 )
        })
    }
    
    message.channel.bulkDelete(args[0]);
    
    message.reply(`Deleting \`${args[0]}\` messages!`).then(msg => {
        setTimeout( () => msg.delete, 2000 )
    });
}

exports.study = async (message, args, guildRoles) => {
    BOT_PREFIX = message['__BOT_PREFIX']

    message.author.send('You\'re now studying!')

    message.guild.channels.cache.get(CHANNELS.stopStudyChannel).send(`Welcome ${message.author} to Study Mode. Type \`${BOT_PREFIX}stop\` to end the session.`)
    guildRoles.forEach(async (r) => {
        if(r.role.name === 'Studying') await message.member.roles.add(r.role.id)
    })

    message.delete()
}

exports.stop = async (message, args, guildRoles) => {
    if (message.channelId !== CHANNELS.stopStudyChannel) return // Command should only work inside the stop-study channel
    guildRoles.forEach(async (r) => {
        if(r.role.name === 'Studying') await message.member.roles.remove(r.role.id)
    })

    message.author.send('Study Mode Ended!')
}

exports.ping = (message, args) => {
    console.log('Pong!')
}

exports.set = (message, args, guildRoles) => {
    // Check if Authorisation is correct
    if(!message.member.roles.cache.some(r => r.name === 'Admin'))
    {
        message.reply('You do not have authorisation!')
        return
    }

    // Check if the parameter is valid (e.g prefix etc)
    
    const valuesData = JSON.parse(fs.readFileSync(path.join(__dirname + '/../values.json')))
    if(!valuesData[`${args[0]}`]) return // Value not in JSON File

    // Change the value
    if(serverCommands.changeEnvInfo(args[0], args[1]))
    {
        message.reply(`Changed the value of \`${args[0]}\` to \`${args[1]}\` successfully!`)
    }
}