const mqtt = require('mqtt');
const WebSocket = require('ws');

// MQTT connection settings
const protocol = 'mqtt';
const host = 'eu1.cloud.thethings.network';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'reclaimers-application@ttn',
    password: 'NNSXS.KWM4WJNYY47RSOAIYTLN5P4JKP34PZQ5YLHPP3Y.BLC7H3ALK7KZ42PTWVM4GIYNVCP3CN6WCYEY5PQZTMFPZNFLSBFQ',
    reconnectPeriod: 1000,
});

// Define the WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Subscribe to the topic (replace 'your/topic' with the actual topic)
client.on('connect', () => {
    const topic = 'v3/reclaimers-application@ttn/reclaimerssignaltesters/';
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error(`Failed to subscribe: ${err}`);
        }
    });
});

// Listen for messages from the MQTT broker
client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());  // Assuming the data is in JSON format
    console.log(`Received Message: ${message.toString()} on topic: ${topic}`);

    // Send the message to each WebSocket client
    wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ topic, data }));
        }
    });
});
