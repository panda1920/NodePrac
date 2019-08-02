const {MongoClient: mongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://192.168.1.6:3000";
const databaseName  = "taskDB";

mongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log(`Unable to connect to database: ${error}`);
        return;
    }

    const db = client.db(databaseName);
    
    // fillDBWithSampleData(db);
    // findRecords(db);
    // updateRecords(db);
    deleteRecords(db);
});

function fillDBWithSampleData(db) {

    let id = new ObjectID();

    db.collection("users").insertOne({
        name: "Vicrum",
        age: 26,
        _id: id
    }, (error, result) => {
        if (error) {
            return console.log("Unable to insert document");
        }

        console.log(result.ops);
    });
    db.collection("users").insertMany(
        [
            {name: "Gunther", age: 31},
            {name: "Alexander", age: 13},
            {name: "Stukov", age: 54},
            {name: "Vladimir", age: 72},
            {name: "Alyosha", age: 13}
        ],
        (error, result) => {
            if (error) return console.log("Unable to insert documents");

            console.log(result.ops);
        }
    )
    db.collection("tasks").insertMany(
        [
            {description: "study node.js", completed: false},
            {description: "study docker",  completed: true},
            {description: "practice drumming", completed: true},
        ],
        (error, result) => {
            if (error) return console.log("Unable to insert documents");

            console.log(result.ops);
        }
    )
}
function findRecords(db) {
    db.collection("users").findOne({ name: "Josh" }, (error, user) => {
        if (error) return console.log("Unable to fetch user");

        console.log(user);
    });

    db.collection("users").find({ age: {$gt: 1}}).toArray((error, results) => {
        if (error) return console.log("Unable to fetch user");

        console.log("printing results found...");
        for (user of results) {
            console.log(user);
        }
    });
    db.collection("tasks").find({ completed: {$eq: false}}).toArray((error, results) => {
        if (error) return console.log("Unable to fetch task");

        console.log("printing results found...");
        for (task of results) {
            console.log(task);
        }
    });
}
function updateRecords(db) {
    // db.collection("users").updateOne(
    //     {_id: new ObjectID("5d1e18a55f34b975d0b3ef92")},
    //     {
    //         $set: {
    //             name: "GuntherUpdated"
    //         }
    //     }
    // ).then(result => {
    //     console.log(result);
    // }).catch(reason => {
    //     console.log(reason);
    // });
    db.collection("users").updateMany(
        {age: 13},
        {
            $set : {
                numCarsOwned: 2
            }
        }
    ).then(result => {
        console.log(`You have updated ${result.result.nModified} documents`);
    }).catch(reason => {
        console.log(reason);
    });
}
function deleteRecords(db) {
    // db.collection("users").deleteMany(
    //     {age: {$gt: 20}},
    // ).then(result => {
    //     console.log(`You have deleted ${result.deletedCount} records`);
    // }).catch(error => {
    //     console.log(error);
    // });
    db.collection("tasks").deleteOne(
        {description: "practice drumming"}
    ).then(result => {
        console.log(`You have deleted ${result.deletedCount} records`);
    }).catch(error => {
        console.log(error);
    });
}