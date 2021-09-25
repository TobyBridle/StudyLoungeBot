module.exports = {
    name: 'speak',
    alias: 'unmute',
    description: 'Allows a silenced user to speak',
        usage: '<user>',
        guildOnly: true,
        arguments: true,
        permissions: ['MUTE_MEMBERS'],

    execute: function(message, args){

        // Remove 'Muted' Role
        const targetUser = message.mentions.members.first()
        if(targetUser)
        {
            const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
            if(targetUser.roles.remove(mutedRole.id)) message.reply(`Unmuted ${targetUser}`)
            return
        }
        message.reply('Invalid User!')
        return
    }
}