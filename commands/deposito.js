const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("depósito")
        .setDescription("Faça um depósito para evitar perder parte de seu saldo.")
        .addStringOption(option =>
            option.setName("ação")
                .setDescription("Escolha a ação que deseja realizar")
                .setRequired(true)
                .addChoices(
                    { name: "Depositar", value: "depositar" },
                    { name: "Sacar", value: "sacar" }
                )
        )
        .addIntegerOption(option =>
            option.setName("quantia")
                .setDescription("Quantidade de fichas para depositar ou sacar.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.user;
        const action = interaction.options.getString("ação");
        const quantia = interaction.options.getInteger("quantia");

        // Verificar se a quantia é um valor positivo
        if (quantia <= 0) {
            return interaction.reply("A quantia deve ser maior que zero.");
        }

        // Recuperar saldo do usuário do banco de dados
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('saldo, deposito')
            .eq('userId', user.id)
            .single(); // Garantir que retornamos apenas um usuário

        if (fetchError) {
            console.error(fetchError);
            return interaction.reply("Erro ao acessar o saldo do usuário.");
        }

        if (action === "depositar") {
            // Atualizar saldo e depósito
            const { data: updatedSaldo, error: updateError } = await supabase
                .from('users')
                .update({
                    saldo: userData.saldo - quantia,
                    deposito: userData.deposito + quantia
                })
                .eq('userId', user.id);

            if (updateError) {
                console.error(updateError);
                return interaction.reply("Erro ao realizar o depósito.");
            }

            return interaction.reply(`💲Você depositou **${quantia}** fichas com sucesso!`);
        }

        if (action === "sacar") {
            // Verificar se o usuário tem saldo suficiente para sacar
            if (userData.saldo < quantia) {
                return interaction.reply("Você não possui saldo suficiente para realizar este saque.");
            }

            // Atualizar saldo e retirar a quantia
            const { data: updatedSaldoAfterWithdrawal, error: withdrawError } = await supabase
                .from('users')
                .update({
                    saldo: userData.saldo + quantia,
                    deposito: userData.deposito - quantia 
                })
                .eq('userId', user.id);

            if (withdrawError) {
                console.error(withdrawError);
                return interaction.reply("Erro ao realizar o saque.");
            }

            return interaction.reply(`👌 Você sacou **${quantia}** fichas com sucesso! .`);
        }
    }
};
