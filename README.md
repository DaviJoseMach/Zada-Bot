# Zada Bot

## O que é

Zada Bot é um bot para Discord desenvolvido com a biblioteca Discord.js. Ele foi criado para funcionar como um cassino apenas para diversão dos membros dos servidores com fichas falsas e diversos modos e jogos para a interação de todos. O bot possui um site para mais informações - Confira o repositório do site [aqui](https://github.com/DaviJoseMach/Zada-Web).

## Tecnologias Utilizadas

-   **JavaScript**
    
-   **Discord.js** (versão mais atualizada)
    

## Dependências

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.47.10",
    "discord.js": "^14.16.3",
    "dotenv": "^16.4.7"
  }
}
```

## Explicação de arquivos

### `deploy-teste.js`

Este arquivo faz o deploy dos comandos para um servidor específico, configurado no arquivo `.env` com a variável `GUILD_ID`.

### `deploy-global.js`

Realiza o deploy global dos comandos para todos os servidores em que o bot está presente. Note que os comandos podem levar até 3 horas para estarem disponíveis devido à propagação no servidor do Discord.

### `.env`

Armazena as variáveis de ambiente necessárias para o funcionamento do bot. Exemplo:

```c
TOKEN=
CLIENT_ID=
GUILD_ID=
```

### `clear-global.js` e `clear-guild.js`

Estes arquivos limpam os comandos registrados globalmente ou em um servidor específico.

#### Exemplo de código para limpar comandos globais:

```js
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removendo comandos globais...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );
        console.log('✅ Comandos globais removidos!');
    } catch (error) {
        console.error('❌ Erro ao remover comandos globais:', error);
    }
})();
```

#### Exemplo de código para limpar comandos da guild:

```js
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removendo comandos específicos da guild...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        );
        console.log('✅ Comandos da guild removidos!');
    } catch (error) {
        console.error('❌ Erro ao remover comandos da guild:', error);
    }
})();
```

## Como Contribuir

1.  Faça um fork do repositório.
    
2.  Crie uma branch para sua funcionalidade/correção: `git checkout -b minha-feature`.
    
3.  Faça commit das suas alterações: `git commit -m 'Adiciona nova funcionalidade'`.
    
4.  Envie para o repositório remoto: `git push origin minha-feature`.
    
5.  Abra um Pull Request.
    

## Contato

Se encontrar algum problema ou tiver sugestões, você pode abrir uma issue no repositório ou me chamar diretamente no [Twitter](https://x.com/davvzin).