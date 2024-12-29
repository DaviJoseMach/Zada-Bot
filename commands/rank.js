const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Exibe um rank dos mais ricos do cassino (global)"),

    async execute(interaction) {
        try {
            const { data: rank, error } = await supabase
                .from("users")
                .select("nome, saldo")
                .order("saldo", { ascending: false });

            if (error) {
                return interaction.reply("🚫 Não foi possível carregar o ranking. Tente novamente mais tarde.");
            }

            const embed = new EmbedBuilder()
                .setColor("#4682B4")
                .setTitle("🏆 Ranking dos Mais Ricos do Cassino 🏆")
                .setDescription("Veja os jogadores mais ricos do cassino abaixo!");

            rank.slice(0, 10).forEach((user, index) => {
                embed.addFields({
                    name: `#${index + 1} - ${user.nome}`,
                    value: `💰 **${user.saldo} fichas**`,
                    inline: false,
                });
            });

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erro ao obter o ranking:", error);
            return interaction.reply("🚫 Houve um erro ao tentar exibir o ranking. Tente novamente mais tarde.");
        }
    },
};
