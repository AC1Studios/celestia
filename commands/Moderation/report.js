// Copyright (c) 2020 Azura Apple. All rights reserved. MIT license.

const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');

class Report extends Command {
  constructor(client) {
    super(client, {
      name: "report",
      description: "Reports a user to the server's staff.",
      category: "Moderation",
      usage: "report <@USER_MENTION> <Reason / Info>",
      guildOnly: true
    });
  }
  
  async run(message, args, level, settings) {
    if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send(`🚫 | I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"Embed Links\" permission.`);

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
   
    if (!user || !reason) return message.react("🚫"), message.reply('Command Usage: `report <@USER_MENTION> <Reason / Info>`')

    message.delete();

    const embed = new RichEmbed()
      .setTitle(`🚩 | __**Report received from ${message.author.tag} (${message.author.id})**__`)
      .setColor('RANDOM')
      .addField('Target:', `${user.tag} (${user.id})`)
      .addField('Reason:', `${reason}`)
      .addField('Channel:', `#${message.channel.name}`)
      .setFooter('Moderation system powered by Celestia <3', this.client.user.displayAvatarURL)
      .setTimestamp();
    message.channel.send({ embed })
    .then(() => {
      message.channel.send("☑️ | Report successfully sent.");
    })
    .catch(error => {
      this.client.logger.error(error);
      return message.channel.send(`🚫 | An error occurred:\n\```${error.message}\````);
    });
  }
}

module.exports = Report;