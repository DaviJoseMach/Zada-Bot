const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getLogs } = require("../log"); // Importa os logs

module.exports = {
    data: new SlashCommandBuilder()
        .setName("req-list")
        .setDescription("Mostra as últimas interações registradas (somente para admins)."),

    async execute(interaction) {
        const membro = interaction.user;

        // Verificar se o usuário é admin
        const supabase = require("../db-connect");
        const { data: usuario, error: usuarioError } = await supabase
            .from("users")
            .select("type")
            .eq("userId", membro.id)
            .single();

        if (usuarioError || !usuario || usuario.type !== "admin") {
            return interaction.reply({
                content: "🚫 Apenas administradores podem executar este comando.",
                ephemeral: true,
            });
        }

        const logs = getLogs(); // Recupera os logs
        if (logs.length === 0) {
            return interaction.reply({
                content: "⚠️ Nenhuma interação foi registrada até o momento.",
                ephemeral: true,
            });
        }

        const topRequests = logs.slice(0, 10); // Pega as 3 mais recentes
        const embed = new EmbedBuilder()
            .setTitle("📋 Últimas Requisições")
            .setColor(0x00AE86);

        topRequests.forEach((log, index) => {
            embed.addFields({
                name: `#${index + 1} - ${log.command}`,
                value: `**Servidor: ** ${log.server}\n**Canal:** ${log.channel}\n**Data:** ${log.timestamp.toLocaleString()}`,
                inline: false,
            });
        });

        return interaction.reply({ embeds: [embed] });
    },
};
