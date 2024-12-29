const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletar-user")
        .setDescription("Deleta um usuário do cassino (Apenas para administradores).")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Selecione o jogador que será deletado.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const deleteId = user.id;
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

            const { data: deleteduser, error: deleteduserError } = await supabase
                .from("users")
                .delete()
                .eq("userId", deleteId);

            if (deleteduserError) {
                return interaction.reply("❌ Ocorreu um erro ao deletar o usuário.");
            }

            return interaction.reply(`🗑️ Usuário <@${deleteId}> foi evaporado do cassino.`);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("❌ Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }
    },
};
