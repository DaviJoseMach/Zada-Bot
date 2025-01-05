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
                "🔹  </ajuda:1324542810279641128> - *Precisa de ajuda? Veja como começar!*\n" +
                "🌐  </site:1324542810476515331> - *Acesse o site oficial do Zada!*\n" +
                "🤖  </convite:1324542810476515328> - *Convide o Zada para seu servidor!*\n" +
                "🐱 </git:1324542810279641136> - *Veja o repositório do Zada no GitHub!*\n \n" + 
                "💵  </getficha:1324542810279641134> - *Obtenha suas fichas iniciais para começar a jogar.*\n" +
                "🎲  </apostar:1324542810279641129> - *Multiplique seu valor em 2x, 4x ou 8x*\n" +
                "⚔️  </x1:1324542810476515335> - *Enfrente outro jogador valendo 100 fichas*\n" +
                "🔖 </info:1324542810279641137> - *Veja informações gerais sobre o cassino.*\n" +
                "👤  </perfil:1324542810476515334> - *Confira suas informações pessoais e saldo.*\n" +
                "📝  </registrar:1324542810476515330> - *Registre-se no cassino e comece a apostar.*\n" +
                "🪙  </jogar-moeda:1324542810279641130> - *Teste sua sorte com cara ou coroa!*\n" +
                "📩  </depósito:1324542810279641130> - *Deposite ou saque suas fichas*\n" +
                "⚡   </tudo-ou-nada:1324542810476515333> - *Dobre seu saldo ou perca tudo!*\n" +
                "🏅  </rank:1324542810476515329> - *Confira o ranking dos jogadores mais ricos.*\n" +
                "🧌  </confronto:1324542810279641132> - *Multiplique seu dinheiro em 32x derrotando um monstro!*\n" +
                "📤  </pix:1324542810476515332> - *Envie fichas para outro jogador.*\n\n"
            )
            .setFooter({ text: "Divirta-se no Cassinão e boa sorte! 🍀" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
