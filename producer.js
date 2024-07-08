const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 3000;
const QUEUE = 'task_queue';

app.use(express.json());

app.post('/send', (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).send('Message is required');
    }

    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(QUEUE, {
                durable: true
            });
            const messageBuffer = Buffer.from(JSON.stringify(message));

            channel.sendToQueue(QUEUE, messageBuffer, {
                persistent: true
            });
            console.log(`[x] Sent ${message}`);

            res.send('Message sent');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Producer API is running on http://localhost:${PORT}`);
});
