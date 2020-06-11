// Copyright (c) 2020 Azura Apple. All rights reserved. MIT license.

const Command = require("../../base/Command.js");
const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");
const { UNSPLASH_ACCESS_KEY } = process.env;

class ImageSearch extends Command {
    constructor(client) {
      super(client, {
        name: "image-search",
        description: "Sends a random image based on your query.",
        category: "Image",
        usage: "image-search <query>",
        aliases: ["isearch", "i-search", "imagesearch"]
      });
    }

    async run(message, args, level, settings) { // eslint-disable-line no-unused-vars
        let query = args.join(" ");
        if (!query) return message.channel.send("You must specify a search query.");
        else query = encodeURIComponent(args.join(" "));

        const page = Math.floor(Math.random() * 5) + 1;
        const index = Math.floor(Math.random() * 10) + 1;

        const randomColor = "#0000".replace(/0/g, () => {
          return (~~(Math.random() * 16)).toString(16);
        });

        const meta = { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` };

        message.channel.startTyping();

        fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}`, { headers: meta })
          .then(res => res.json())
          .then(json => {
            const data = json.results[parseInt(index.toFixed(0))];
            const embed = new RichEmbed()
              .setTitle("📷 Image")
              .setURL(data.urls.raw)
              .setDescription(`Photo by [${data.user.name}](${data.user.links.html}) on [Unsplash](https://unsplash.com)`)
              .setImage(data.urls.raw)
              .setColor(randomColor)
              .setTimestamp();
            message.channel.send({ embed });
          })
          .catch(error => {
            message.channel.stopTyping(true);
            if (error.message === "Cannot read property 'urls' of undefined") return message.channel.send('No results found.');
            this.client.logger.error(error);
            return message.channel.send(`An error occurred: ${error.message}`);
          });

        message.channel.stopTyping(true);
    }
}

module.exports = ImageSearch;
