require('dotenv').config()
const { BOT_PREFIX } = process.env
const Discord = require('discord.js')

const CHANNELS = {
    'stopStudyChannel': '882783531531653210'
}

const changeEnv = require('../server.js')

exports.study = async (message, args, guildRoles) => {
    if(!typeof([args][0], 'int') && args) return message.reply(`To enter study mode:\n${BOT_PREFIX}study`)
    
    message.author.send('You\'re now studying!')

    message.guild.channels.cache.get(CHANNELS.stopStudyChannel).send(`Welcome ${message.author} to Study Mode. Type \`${BOT_PREFIX}stop\` to end the session.`)
    guildRoles.forEach(r => {
        if(r.role.name === 'Studying') message.member.roles.add(r.role.id)
    })

    await message.delete()
}

exports.stop = async (message, args, guildRoles) => {
    if (message.channelId !== CHANNELS.stopStudyChannel) return 0
    guildRoles.forEach(r => {
        if(r.role.name === 'Studying') message.member.roles.remove(r.role.id)
    })

    await message.author.send('Study Mode Ended!')
}
exports.ping = (message, args) => {
    console.log('Pong!')
}

exports.set = (message, args, guildRoles) => {
    changeEnv('BOT_PREFIX', args[0])
}