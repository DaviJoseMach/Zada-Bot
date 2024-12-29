const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("performance")
        .setDescription("Exibe o consumo de RAM e a latência do bot (apenas para administradores)."),

    async execute(interaction) {
        const membro = interaction.user;

        try {
            // Verifica se o usuário é um administrador
            const { data: usuario, error: usuarioError } = await supabase
                .from("users")
                .select("type")
                .eq("userId", membro.id)
                .single();

            if (usuarioError || !usuario) {
                return interaction.reply("🚫 Não foi possível verificar sua permissão no sistema.");
            }

            if (usuario.type !== "admin") {
                return interaction.reply("🚫 Apenas administradores podem executar este comando.");
            }

            // Calcula o uso de memória
            const memoryUsage = process.memoryUsage();
            const usedRAM = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
            const totalRAM = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);

            // Calcula a latência
            const sentTime = Date.now();
            const message = await interaction.reply({ content: "Calculando latência...", fetchReply: true });
            const latency = Date.now() - sentTime;
            const apiLatency = interaction.client.ws.ping;

            // Exibe os resultados
            return interaction.editReply(`📊 **Performance do Bot**\n\n**Uso de RAM:** ${usedRAM} MB / ${totalRAM} MB\n**Latência:** ${latency}ms\n**Latência da API:** ${apiLatency}ms`);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados. Tente novamente mais tarde.");
        }
    },
};
