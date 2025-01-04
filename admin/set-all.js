const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-all")
        .setDescription("Seta a mesma quantidade de fichas a todos os players do cassino (Apenas administradores)")
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

            // Buscar todos os usuários
            const { data: usuarios, error: usuariosError } = await supabase
                .from("users")
                .select("userId, saldo");

            if (usuariosError) {
                return interaction.reply("🚫 Não foi possível acessar os dados dos usuários.");
            }

            // Atualizar o saldo de todos os usuários
            const updates = usuarios.map(user => ({
                userId: user.userId, // Deve coincidir com a chave única da tabela
                saldo: user.saldo == quantia
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

            return interaction.reply(`<a:saldo:1320913551623196685>  Fichas setadas! Cada usuário ficou com **${quantia}** fichas.`);
        } catch (error) {
            console.error(error);
            return interaction.reply("🚫 Ocorreu um erro inesperado ao executar o comando.");
        }
    }
};
