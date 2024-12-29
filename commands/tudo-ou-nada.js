const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tudo-ou-nada")
        .setDescription("Aposte tudo ou nada! Dobrar ou perder tudo?"),

    async execute(interaction) {
        const winUser = "813149555553468438"; 
        const membro = interaction.user; 

        // Verificar o saldo do jogador no banco
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



        // Sempre vence se for o usuário específico
        const venceu = interaction.user.id === winUser || Math.random() < 0.5;

        // Calcula o novo saldo
        const novoSaldo = venceu ? saldoAtual * 2 : 0;

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
            content: venceu
                ? `<a:money:1320419558909280257> Você apostou tudo e venceu! Seu saldo agora é **${novoSaldo} moedas**! Dobrou a sorte!`
                : `<a:cry:1320419354281508904> Você apostou tudo e perdeu... Seu saldo agora é **0 moedas**. Mais sorte na próxima!`
        });
    },
};
