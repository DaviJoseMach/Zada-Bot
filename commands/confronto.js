const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confronto")
        .setDescription("Confronte um monstro lendário (jogue dois dados e aposte sua sorte).")
        .addIntegerOption(option =>
            option.setName("valor")
                .setDescription("Informe o valor que deseja apostar.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const membro = interaction.user;

        // Obtém o valor apostado
        const valorApostado = interaction.options.getInteger("valor");

        if (valorApostado <= 0) {
            return interaction.reply("🚫 O valor apostado deve ser maior que 0.");
        }

        try {
            // Recupera o saldo do usuário no banco de dados
            const { data: usuario, error: usuarioError } = await supabase
                .from("users")
                .select("saldo")
                .eq("userId", membro.id)
                .single();

            if (usuarioError || !usuario) {
                return interaction.reply("🚫 Não foi possível acessar sua conta no sistema.");
            }

            // Verifica se o saldo é suficiente
            if (usuario.saldo < valorApostado) {
                return interaction.reply("🚫 Você não tem saldo suficiente para apostar esse valor.");
            }

            // Rolagem dos dados
            const dadoJogador = Math.floor(Math.random() * 100) + 1; // 1-100
            const dadoMonstro = Math.floor(Math.random() * 500) + 1; // 1-500

            let resultadoMensagem = `<a:dado:1320913293203996714> Você rolou **${dadoJogador}**.\n<a:gojo:1320913250417905805> O monstro rolou **${dadoMonstro}**.\n\n`;

            if (dadoJogador > dadoMonstro) {
                // Vitória do jogador
                const premio = valorApostado * 100; // Multiplicador 100x
                const novoSaldo = usuario.saldo + premio;

                // Atualiza o saldo no banco de dados
                const { error: updateError } = await supabase
                    .from("users")
                    .update({ saldo: novoSaldo })
                    .eq("userId", membro.id);

                if (updateError) {
                    console.error("Erro ao atualizar saldo:", updateError);
                    return interaction.reply("Erro ao atualizar seu saldo. Tente novamente mais tarde.");
                }

                resultadoMensagem += `<:goku:1320913488239132712> Você venceu e ganhou **${premio} fichas**!\n<a:saldo:1320913551623196685> Novo saldo: **${novoSaldo} fichas**.`;
            } else {
                // Derrota do jogador
                const novoSaldo = usuario.saldo - valorApostado;

                // Atualiza o saldo no banco de dados
                const { error: updateError } = await supabase
                    .from("users")
                    .update({ saldo: novoSaldo })
                    .eq("userId", membro.id);

                if (updateError) {
                    console.error("Erro ao atualizar saldo:", updateError);
                    return interaction.reply("Erro ao atualizar seu saldo. Tente novamente mais tarde.");
                }

                resultadoMensagem += `<a:bravo:1320418570445918288> Você perdeu **${valorApostado} fichas**.\n<a:encarada:1320913585106587689> Novo saldo: **${novoSaldo} fichas**.`;
            }

            return interaction.reply(resultadoMensagem);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados. Tente novamente mais tarde.");
        }
    },
};
