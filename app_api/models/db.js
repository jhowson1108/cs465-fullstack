const mongoose = require('mongoose');
const readLine = require('readline');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

// Build the connection string and connect
const connect = () => {
    setTimeout(() => {
        mongoose.connect(dbURI, {}).catch(err => {
            console.log('Mongoose initial connection failed: ', err.message);
        });
    }, 1000);
};

// Monitor connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Windows specific listener
if (process.platform === 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r1.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Configure for graceful shutdown
const gracefulShutdown = async (msg) => {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${msg}`);
};

// Event listeners to process graceful shutdowns

// Shutdown invoked by nodemon signal
process.once('SIGUSR2', async () => {
    await gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

// Shutdown invoked by app termination
process.on('SIGINT', async () => {
    await gracefulShutdown('app termination');
    process.exit(0);
});

// Shutdown invoked by container termination
process.on('SIGTERM', async () => {
    await gracefulShutdown('app shutdown');
    process.exit(0);
});

// Make initial connection to DB
connect();

// Import Mongoose schema
require('./travlr');
module.exports = mongoose;
