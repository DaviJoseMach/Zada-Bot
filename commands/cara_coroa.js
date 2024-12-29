const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jogar-moeda")
        .setDescription("Joga uma moeda, ou você ganha 50% do seu saldo atual ou perde 50%")
        .addStringOption(option =>
            option
                .setName("escolha")
                .setDescription("Escolha entre 'cara' ou 'coroa'")
                .setRequired(true)
                .addChoices(
                    { name: "Cara", value: "cara" },
                    { name: "Coroa", value: "coroa" }
                )
        ),

    async execute(interaction) {
        const membro = interaction.user; // Usuário que executou o comando
        const escolha = interaction.options.getString("escolha");

        // Verificar o saldo do jogador no banco (exemplo fictício com Supabase)
        const { data: userData, error } = await supabase
            .from("users")
            .select("saldo")
            .eq("userId", membro.id)
            .single();

        if (error || !userData) {
            return interaction.reply({
                content: "Não foi possível verificar seu saldo. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }

        const saldoAtual = userData.saldo;

        if (saldoAtual <= 0) {
            return interaction.reply({
                content: "Você não tem saldo suficiente para apostar.",
                ephemeral: true,
            });
        }

        // Jogar a moeda
        const resultado = Math.random() < 0.5 ? "cara" : "coroa";
        const venceu = escolha === resultado;

        // Calcula o novo saldo
        const alteracaoSaldo = Math.floor(saldoAtual / 2);
        const novoSaldo = venceu
            ? saldoAtual + alteracaoSaldo
            : saldoAtual - alteracaoSaldo;

        // Atualizar saldo no banco
        const { error: updateError } = await supabase
            .from("users")
            .update({ saldo: novoSaldo })
            .eq("userId", membro.id);

        if (updateError) {
            return interaction.reply({
                content: "Houve um problema ao atualizar seu saldo. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }

        // Responder o resultado
        return interaction.reply({
            content: `🪙 Você escolheu **${escolha}** e a moeda caiu em **${resultado}**!\n` +
                `Você ${venceu ? "venceu <:feliz:1320418504884752536>" : "perdeu <a:bravo:1320418570445918288>"} a aposta e seu novo saldo é **${novoSaldo} moedas**.\n` 
        });
    },
};
