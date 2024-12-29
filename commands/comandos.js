const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("comandos")
        .setDescription("Comandos e funções do bot"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700") // Cor dourada para dar um toque de cassino
            .setTitle(":love_you_gesture:  **Comandos do Cassinão** 💰")
            .setDescription(
                "Aqui estão todos os comandos disponíveis para você se divertir e no cassino:\n\n" +
                "📚 **Comandos Gerais:**\n \n" +
                "🔹  </ajuda:1320799893190607009> - *Precisa de ajuda? Veja como começar!*\n" +
                "💵  </getficha:1320799893190607015> - *Obtenha suas fichas iniciais para começar a jogar.*\n" +
                "🎲  </apostar:1320800498139398275> - *Multiplique seu valor em 2x, 4x ou 8x*\n" +
                "🔖 </info:1320799893190607016> - *Veja informações gerais sobre o cassino.*\n" +
                "👤  </perfil:1320799893358514188> - *Confira suas informações pessoais e saldo.*\n" +
                "📝  </registrar:1320799893190607018> - *Registre-se no cassino e comece a apostar.*\n" +
                "🪙  </jogar-moeda:1320799893190607013> - *Teste sua sorte com cara ou coroa!*\n" +
                "⚡  </tudo-ou-nada:1320799893358514187> - *Dobre seu saldo ou perca tudo!*\n" +
                "🏅  </rank:1320799893190607017> - *Confira o ranking dos jogadores mais ricos.*\n" +
                "🧌  </confronto:1320912125945839706> - *Multiplique seu dinheiro em 32x derrotando um monstro!*\n" +
                "📤  </pix:1320799893358514186> - *Envie fichas para outro jogador.*\n\n"
            )
            .setFooter({ text: "Divirta-se no Cassinão e boa sorte! 🍀" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
