const amqp = require('amqplib/callback_api');

const QUEUE = 'task_queue';

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

        channel.prefetch(1);

        console.log(`[*] Waiting for messages in ${QUEUE}. To exit press CTRL+C`);

        channel.consume(QUEUE, (msg) => {
            if (msg !== null) {
                console.log(`[x] msg ${JSON.stringify(msg.content)}`);

                const content = msg.content.toString();
                console.log(`[x] Received ${content}`);
                
                // Simulate processing time
                setTimeout(() => {
                    console.log(`[x] Done processing ${content}`);
                    channel.ack(msg);
                }, 1000);
            }
        });
    });
});
