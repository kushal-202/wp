const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth() // Save session to avoid QR scan repeatedly
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.on('qr', (qr) => {
    console.log('Scan this QR Code to log in:', qr);
});

// API Endpoint to send message
app.post('/send', (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).send("Number and message are required!");
    }

    const formattedNumber = `${number}@c.us`; // WhatsApp format
    client.sendMessage(formattedNumber, message)
        .then(() => res.status(200).send("Message sent!"))
        .catch((err) => res.status(500).send(`Error: ${err}`));
});

// Start Express server
app.listen(3000, () => {
    console.log('Node.js server is running on http://localhost:3000');
});

client.initialize();
