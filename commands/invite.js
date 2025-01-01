const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convite")
        .setDescription("Convide o Zada para o seu servidor!"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#1E90FF") 
            .setTitle("> **Convide o Zada para seu servidor! 🚀**")
            .setImage("https://cdn.discordapp.com/attachments/1320878140414758995/1323433322268856433/HEADER.png?ex=67747ed4&is=67732d54&hm=a2f3797c5dc6299899875fa42fec044c64eaf7d60327582361697710e93ba46a&")
            .setDescription(
                "Quer aproveitar o Zada no seu servidor? Convide o Zada agora mesmo e comece a diversão com seus amigos!"
            )
            .setFooter({ text: "Convide o Zada e divirta-se no Cassinão! 🎲" }) // Rodapé com mensagem personalizada
            .setTimestamp();

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("⬆️ Convide o Zada")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/oauth2/authorize?client_id=1318688407605477507&permissions=8&integration_type=0&scope=bot") // Substitua pelos detalhes corretos
        );

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};
