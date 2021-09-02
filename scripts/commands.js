const serverCommands = require('../server.js');
const Discord = require('discord.js')
var BOT_PREFIX = ''

serverCommands.getValues('../')

const CHANNELS = {
    'stopStudyChannel': '882783531531653210'
}

exports.study = async (message, args, guildRoles) => {
    if(!typeof([args][0], 'int') && args)
    {
        message.reply(`To enter study mode:\n${BOT_PREFIX}study`)
        return
    }

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
    serverCommands.changeEnvInfo('BOT_PREFIX', args[0])
}