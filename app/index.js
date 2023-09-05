require('dotenv').config()

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fieldSize: 25 * 1024 * 1024  } });

const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.BOT_TOKEN;

const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

/*===== DISCORD BOT =====*/
let channel;

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    
    const channels = await guild.channels.fetch();

    channel = channels.get(process.env.CHANNEL_ID);
});

client.login(token);

/*===== EXPRESS SERVER =====*/
app.use(express.json());

// File size limit in bytes
const fileSizeLimit = 25 * 1000000;

app.post('/', upload.single('file'), async (req, res) => {

    if (process.env.API_KEY && req.headers['x-api-key'] != process.env.API_KEY) {
        return res.status(401).send('Error: unauthorized');
    }

    const fileName = req.file.originalname;
    const file = req.file.buffer;

    const fileSize = Buffer.byteLength(file);
    if (fileSize > fileSizeLimit) {
        return res.status(400).send(`Error: file size (${Math.floor(fileSize / 1000000)} MB) exceeds ${Math.floor(fileSizeLimit / 1000000)}`);
    }

    const message = await channel.send({
        files: [
            { attachment: file, name: fileName }
        ]
    });

    const url = message.attachments.values().next().value.attachment;

    console.log(`${fileName} uploaded to: ${url}`);

    res.send({
        url: url
    });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});