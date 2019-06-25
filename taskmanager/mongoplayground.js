const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://192.168.1.6:3000";
const databaseName  = "taskDB";

mongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log(`Unable to connect to database: ${error}`);
        return;
    }

    const db = client.db(databaseName);
    
    db.collection("users").insertOne({
        name: "Josh",
        age: 16
    });
});

