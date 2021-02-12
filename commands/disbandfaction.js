/* EXTERNAL MODULES */
const Discord = require("discord.js");
const DataManager = require("../resource/modules/dataManager.js");

module.exports = {
    names: ["disbandfaction", "df"],
    desc: "Disbands a faction",
    async execute(env) {
        /** 
         * @param  {Discord.Message} message
         * @param  {Array} args
         * @param  {Discord.Client} client
        */
        const { message, args, client } = env; // Variables

        var user = DataManager.getUser(message.author.id);
        if(!user) return message.channel.send("**You do not have a profile. Type .start to setup your profile**");
        if(user.group === "") return message.channel.send("**You are not currently in a group. To join a group type .joinfaction**");
        if(user.group.leader != message.author.id) return message.channel.send("**You are not the leader of your group**");


        const confirm = await message.channel.send(`Would you like to transfer ownership of ${user.group} to <@${mentioned.id}>?`);
        await confirm.react("✅");
        await confirm.react("❌");

        await confirm.awaitReactions(
            (reaction, user) => (
                reaction.emoji.name === "✅" || // filters when listening to reactions
                reaction.emoji.name === "❌"
                ) && user.id === message.author.id,
            { max: 1 }
        ).then(collected => {
            const reaction = collected.first();
            if (!reaction) return;
            if (reaction.emoji.name === "✅") {
                // User said yes
                message.channel.send(`**You have successfully disbanded ${user.group}**`); // sends message
                DataManager.removeGroup(user.group); // saves user to databse
                
            } else {
                // User said no
                message.channel.send("**Cancelled**");
            }

            confirm.delete();
        });
    }
}