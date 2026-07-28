const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot activo 24/7'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor listo'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Responde con Pong!'),
  new SlashCommandBuilder().setName('hola').setDescription('Saluda al bot')
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log(`Conectado como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    console.log('Registrando Slash Commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('¡Comandos registrados con éxito!');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('🏓 ¡Pong!');
  } else if (commandName === 'hola') {
    await interaction.reply(`¡Hola, ${interaction.user.username}! 👋`);
  }
});

client.login(process.env.TOKEN);
