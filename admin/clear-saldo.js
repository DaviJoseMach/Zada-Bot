const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear-saldo")
        .setDescription("Zera o saldo de um usuário (apenas para administradores).")
        .addStringOption(option =>
            option.setName("userid")
                .setDescription("ID do Discord do usuário cujo saldo será zerado.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const membro = interaction.user;

        // Obtém o argumento do comando
        const destinatarioId = interaction.options.getString("userid");

        try {
            // Verifica se o usuário que executa o comando é um administrador
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

            // Localiza o destinatário no banco de dados
            const { data: destinatario, error: destinatarioError } = await supabase
                .from("users")
                .select("saldo")
                .eq("userId", destinatarioId)
                .single();

            if (destinatarioError || !destinatario) {
                return interaction.reply(`🚫 Usuário com ID **${destinatarioId}** não encontrado.`);
            }

            // Atualiza o saldo do destinatário para 0
            const { error: updateError } = await supabase
                .from("users")
                .update({ saldo: 0 })
                .eq("userId", destinatarioId);

            if (updateError) {
                console.error("Erro ao atualizar o saldo do destinatário:", updateError);
                return interaction.reply("Erro ao atualizar os dados do destinatário. Tente novamente mais tarde.");
            }

            // Confirma a ação
            return interaction.reply(`✅ O saldo do usuário <@${destinatarioId}> foi zerado com sucesso.`);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados. Tente novamente mais tarde.");
        }
    },
};
