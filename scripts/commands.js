require('dotenv').config()
const { BOT_PREFIX } = process.env
const Discord = require('discord.js')

const changeEnv = require('../server.js')

exports.study = async (message, args, guildRoles) => {
    if(!typeof([args][0], 'int') && args) return message.reply(`To enter study mode:\n${BOT_PREFIX}study`)
    args
    ?
    message.author.send(`You\'re now studying for ${args} minutes`)
    :
    message.author.send('You\'re now studying!')

    message.guild.channels.cache.get('882783531531653210').send(`Welcome ${message.author} to Study Mode. Type \`${BOT_PREFIX}stop\` to end the session.`)
    guildRoles.forEach(r => {
        r.role.name === 'Studying' ? message.member.roles.add(r.role.id) : ''
    })

    await message.delete()
}

exports.stop = (message, args, guildRoles) => {
    console.log(guildRoles.get('Studying'))
}
exports.ping = (message, args) => {
    console.log('Pong!')
}

exports.set = (message, args, guildRoles) => {
    changeEnv('BOT_PREFIX', '!')
}