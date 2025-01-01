const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git")
        .setDescription("Repositório do bot no GitHub"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700") 
            .setTitle("> **✨ Repositório do Zada**")
            .setImage("https://cdn.discordapp.com/attachments/1320878140414758995/1323431408470851677/Zada-Bot.png?ex=67747d0b&is=67732b8b&hm=ad6f7362b0424c5d966abf2f325a31593970b890ec036fa78f669e3ce8a705eb&")
            .setFooter({ text: "Ajude o Zada a crescer com sua contribuição! 💻" }) 
            .setTimestamp();

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🤝 Visite o Repositório")
                .setStyle(ButtonStyle.Link)
                .setURL("https://github.com/DaviJoseMach/Zada-Bot") 
        );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};
