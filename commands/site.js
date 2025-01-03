const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("site")
        .setDescription("Acesse o site oficial do Zada!"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#4CAF50") 
            .setTitle("> **Site Oficial do Zada 🤖**")
            .setDescription("Clique no botão abaixo para acessar o site oficial do Zada!")
            .setFooter({ text: "Visite nosso site e descubra mais! 🌐" })
            .setImage("https://cdn.discordapp.com/attachments/1320878140414758995/1323450366599368814/image.png?ex=67748eb3&is=67733d33&hm=5d373168b7411bf6453d89a5b73c2b718872558a8cf278d623c66b9499170587&")
            .setTimestamp();

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🌐 Acesse o Site")
                .setStyle(ButtonStyle.Link)
                .setURL("https://zadaa.netlify.app/")
        );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};
