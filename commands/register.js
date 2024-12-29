const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect"); // Importa o cliente do Supabase

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registrar")
        .setDescription("Registra seu usuário em nosso cassino"),

    async execute(interaction) {
        const membro = interaction.user;
        const dtRegistro = new Date().toISOString();

        try {
            // Verifica se o usuário já está registrado no banco de dados
            const { data: existingUser, error: fetchError } = await supabase
                .from("users")
                .select("userId")
                .eq("userId", membro.id)
                .single();

            if (fetchError && fetchError.code !== "PGRST116") {
                // Ignora erro "Row not found" (código PGRST116)
                console.error("Erro ao verificar usuário:", fetchError);
                return interaction.reply("Ocorreu um erro ao verificar seu registro. Tente novamente mais tarde.");
            }

            if (existingUser) {
                return interaction.reply(`**${membro.username}**, você já está registrado no cassino!`);
            }

            // Insere o novo usuário no banco de dados
            const { error: insertError } = await supabase
                .from("users")
                .insert({
                    nome: membro.username,
                    userId: membro.id,
                    dt_registro: dtRegistro,
                    saldo: 0,
                    last_rescue_time: 0,
                    type: "user" // Define como usuário comum por padrão
                });

            if (insertError) {
                console.error("Erro ao registrar usuário:", insertError);
                return interaction.reply("Ocorreu um erro ao registrar seu usuário. Tente novamente mais tarde.");
            }

            await interaction.reply(`Bem-vindo ao cassino, ${membro.username}! Seu registro foi concluído.`);
        } catch (error) {
            console.error("Erro inesperado:", error);
            await interaction.reply("Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }
    },
};
