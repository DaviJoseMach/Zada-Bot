const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rem-all")
        .setDescription("Remove certa quantia de fichas de todos os players do cassino (Apenas administradores)")
        .addIntegerOption(option =>
            option.setName("quantia")
                .setDescription("Quantidade de fichas para adicionar.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const membro = interaction.user;
        const quantia = interaction.options.getInteger("quantia");

        try {
            // Verificar se o usuário é admin
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

            const { data: usuarios, error: usuariosError } = await supabase
                .from("users")
                .select("userId, saldo");

            if (usuariosError) {
                return interaction.reply("🚫 Não foi possível acessar os dados dos usuários.");
            }

            // Atualizar o saldo de todos os usuários
            const updates = usuarios.map(user => ({
                userId: user.userId, 
                saldo: user.saldo - quantia
            }));

            // Realizar as atualizações
            const { error: updateError } = await Promise.all(
                updates.map(async update =>
                    supabase
                        .from("users")
                        .update({ saldo: update.saldo })
                        .eq("userId", update.userId)
                )
            );

            if (updateError) {
                console.error(updateError);
                return interaction.reply("🚫 Ocorreu um erro ao atualizar os saldos dos usuários.");
            }

            return interaction.reply(`<a:gojo:1320913250417905805>  Fichas removidas! Cada usuário perdeu **${quantia}** fichas.`);
        } catch (error) {
            console.error(error);
            return interaction.reply("🚫 Ocorreu um erro inesperado ao executar o comando.");
        }
    }
};
