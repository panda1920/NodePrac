const yargs = require("yargs");
const chalk = require("chalk");
const notes = require("./notes.js");

// specify version number
yargs.version = "1.0.0";

// configure supported commands for this app
yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
        body: {
            description: "Note body",
            demandOption: true,
            type: "string"
        }
    },
    handler: function(argv) {
        notes.addNote(argv.title, argv.body);
    }
});
yargs.command({
    command: "remove",
    describe: "remove a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }
    },
    handler: function(argv) {
        notes.removeNote(argv.title);
    }
});
yargs.command({
    command: "list",
    describe: "List all notes",
    handler: function(argv) {
        notes.listNotes();
    }
});
yargs.command({
    command: "read",
    describe: "Read a note",
    builder: {
        title: {
            description: "Title of a note",
            demandOption: true,
            type: "string"
        }
    },
    handler: function(argv) {
        notes.readNote(argv.title);
    }
});

yargs.parse();