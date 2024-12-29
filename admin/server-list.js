const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listar-servidores")
        .setDescription("Lista todos os servidores em que o bot está (Apenas para administradores)."),

    async execute(interaction) {
        const membro = interaction.user;

        try {
            const { data: usuario, error: usuarioError } = await supabase
                .from("users")
                .select("type")
                .eq("userId", membro.id)
                .single();

            if (usuarioError || !usuario) {
                return interaction.reply({
                    content: "🚫 Não foi possível verificar sua permissão no sistema.",
                    ephemeral: true,
                });
            }

            if (usuario.type !== "admin") {
                return interaction.reply({
                    content: "🚫 Apenas administradores podem executar este comando.",
                    ephemeral: true,
                });
            }

            const guilds = interaction.client.guilds.cache;

            if (guilds.size === 0) {
                return interaction.reply({
                    content: "❌ O bot não está em nenhum servidor.",
                    ephemeral: true,
                });
            }

            const serverList = guilds.map(
                guild => `🔹 **${guild.name}** - ${guild.memberCount} membros`
            ).join("\n");

            const embed = new EmbedBuilder()
                .setColor("#FFD700") // Cor dourada
                .setTitle("📜 Aonde estou?")
                .setDescription(serverList)
                .setFooter({ text: `Total de servidores: ${guilds.size}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erro ao listar servidores:", error);
            return interaction.reply({
                content: "❌ Ocorreu um erro ao listar os servidores.",
                ephemeral: true,
            });
        }
    },
};
