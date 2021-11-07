const cdh = require("chuckdatahandler");

module.exports = {
    name: "prefix",
    alias: "setprefix",
    description: "Sets the prefix for the server.",
        usage: "<prefix>",
        guildOnly: true,
        arguments: true,
        permissions: ["MANAGE_SERVER"],

    execute: function(message, args){
        cdh.write_data_guild(message.guild.id, "prefix", String(args[0]));
        message.reply("The new prefix is now **"+String(args[0])+"**.");
        return
    }
}