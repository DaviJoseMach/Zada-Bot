const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ajuda")
        .setDescription("Ajuda com as funções do bot"),

    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor("#DAA520")
            .setTitle("<a:HorseLick:1320421577052917833> A cavalaria chegou <a:HorseLick:1320421577052917833>")
            .setDescription(
                "🎲 **Está perdido?** Veja como começar logo abaixo 🧭 \n \n  **1.** O primeiro passo é se registrar com o comando \n" +
                "🔹  </registrar:1320799893190607018> - *Entre para o Cassinão e comece sua jornada!* \n \n" +
                "**2.** Após isso, você poderá usar o comando \n" +
                "💵  </getficha:1320799893190607015> - *Garanta suas fichas iniciais e prepare-se para jogar!* \n \n" +
                "**3.** Agora é só se divertir com a gente usando \n" +
                "🎲  </apostar:1320800498139398275> - *Aposte 2x, 4x ou 8x de um valor escolhido e multiplique esse valor* \n" +
                "🪙  </jogar-moeda:1320799893190607013> - *Aposte 50% do seu saldo em um emocionante cara ou coroa!* \n" +
                "⚡  </tudo-ou-nada:1320799893358514187> - *Se ganhar, você dobra seu saldo; se perder, perde tudo!* \n" +
                "👤  </perfil:1320799893358514188> - *Confira suas informações, como seu **Saldo** atual!* \n \n" +
                "**Ou digite** </comandos:1320799893190607014> - *Descubra todos os comandos disponíveis e aproveite ao máximo!* 🎉"
            )
            .setImage("https://cdn.discordapp.com/attachments/1293684145897340952/1320441488567570515/HEADER.png?ex=67699c77&is=67684af7&hm=e1b87d43947d2e85b0dfc2f16475cd0685843ea1a77edf78106e55f915a9844b&")
            .setTimestamp()
            .setFooter({ text: "Cassino do Zada", iconURL: interaction.client.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🌐 Acesse o Site")
                .setStyle(ButtonStyle.Link)  // Estilo mais destacado
                .setURL("https://zadabot.netlify.app/"),
            new ButtonBuilder()
                .setLabel("🤖 Convide o Bot")
                .setStyle(ButtonStyle.Link)  // Estilo suave
                .setURL("https://discord.com/oauth2/authorize?client_id=1318688407605477507&permissions=8&integration_type=0&scope=bot"),
            new ButtonBuilder()
                .setLabel("🐱 Repositório no GitHub")
                .setStyle(ButtonStyle.Link)  // Estilo de perigo, vermelho
                .setURL("https://github.com/DaviJoseMach/Zada-Bot")
        );

        await interaction.reply({
            embeds: [helpEmbed],
            components: [row]
        });
    }
};
