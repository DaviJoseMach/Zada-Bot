const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("apostar")
        .setDescription("Aposte e multiplique seu valor!")
        .addStringOption(option =>
            option.setName("multiplicador")
                .setDescription("Escolha o multiplicador: 2x (1-4), 4x (1-8), 8x (1-16)")
                .setRequired(true)
                .addChoices(
                    { name: "2x (1 a 4)", value: "2x" },
                    { name: "4x (1 a 8)", value: "4x" },
                    { name: "8x (1 a 16)", value: "8x" }
                )
        )
        .addIntegerOption(option =>
            option.setName("numero")
                .setDescription("Escolha um número dentro do intervalo correspondente")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("valor")
                .setDescription("Informe o valor que deseja apostar")
                .setRequired(true)
        ),

    async execute(interaction) {
        const membro = interaction.user;
        const userId = membro.id;
        const multiplicador = interaction.options.getString("multiplicador");
        const valorAposta = interaction.options.getInteger("valor");
        const numeroEscolhido = interaction.options.getInteger("numero");

        // Definir os limites com base no multiplicador
        let maxNumero;
        let multiplicadorValor;

        switch (multiplicador) {
            case "2x":
                maxNumero = 4;
                multiplicadorValor = 2;
                break;
            case "4x":
                maxNumero = 8;
                multiplicadorValor = 4;
                break;
            case "8x":
                maxNumero = 16;
                multiplicadorValor = 8;
                break;
            default:
                return interaction.reply("Multiplicador inválido. Tente novamente.");
        }

        if (valorAposta <= 0) {
            return interaction.reply("O valor da aposta deve ser maior que 0.");
        }
        if (numeroEscolhido < 1 || numeroEscolhido > maxNumero) {
            return interaction.reply(
                `Número inválido. Escolha um número entre 1 e ${maxNumero}.`
            );
        }

        try {
            // Buscar usuário no banco
            const { data: user, error } = await supabase
                .from("users")
                .select("saldo")
                .eq("userId", userId)
                .single();

            if (error || !user) {
                return interaction.reply(
                    "Você ainda não foi registrado no sistema. Use o comando `/registrar` para se registrar."
                );
            }

            if (user.saldo < valorAposta) {
                return interaction.reply(
                    `Você não possui fichas suficientes para apostar ${valorAposta}. Seu saldo atual é ${user.saldo}.`
                );
            }

            // Deduzir o valor da aposta do saldo
            let novoSaldo = user.saldo - valorAposta;

            // Gerar número aleatório no intervalo definido pelo multiplicador
            const numeroSorteado = Math.floor(Math.random() * maxNumero) + 1;

            if (numeroEscolhido === numeroSorteado) {
                const ganho = valorAposta * multiplicadorValor;
                novoSaldo += ganho;
                await interaction.reply(
                    `<:feliz:1320418504884752536> Parabéns! O número sorteado foi **${numeroSorteado}**. Você ganhou ${ganho} fichas. Saldo atual: ${novoSaldo}`
                );
            } else {
                await interaction.reply(
                    `<a:bravo:1320418570445918288> Que pena! O número sorteado foi **${numeroSorteado}**. Você perdeu ${valorAposta} fichas. Saldo atual: ${novoSaldo}`
                );
            }

            // Atualizar o saldo do usuário no banco
            const { error: updateError } = await supabase
                .from("users")
                .update({ saldo: novoSaldo })
                .eq("userId", userId);

            if (updateError) {
                console.error("Erro ao atualizar os dados no Supabase:", updateError);
                return interaction.followUp(
                    "Erro ao salvar seus dados. Tente novamente mais tarde."
                );
            }
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados. Tente novamente mais tarde.");
        }
    },
};
