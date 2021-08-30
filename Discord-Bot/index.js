// scale

const Bot = require('./Structures/Bot')

const client = new Bot()

client.start()

process.on("rejectionHandled"   , ( err ) => console.error( err ) );

process.on("unhandledRejection" , ( err ) => console.error( err ) );

process.on("uncaughtException"  , ( err ) => console.error( err ) );

