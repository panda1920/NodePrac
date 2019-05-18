const fs = require("fs");
const chalk = require("chalk");
const FILENAME = "notes.json";

function addNote(title, body) {
    const notes = loadNotes();
    // do not allow duplicate title
    if (notes.some(note => note.title === title)) {
        console.log(chalk.red(`Duplicate note of title: ${title} found!`));
        return;
    }

    notes.push({
        title: title,
        body: body
    });
    saveNotes(notes);
    console.log(chalk.green(`New note added: ${title}`));
}

function removeNote(title) {
    const notes = loadNotes();
    const notesWithoutTitle = notes.filter(note => note.title !== title);

    if (notesWithoutTitle.length === notes.length) {
        console.log(chalk.red(`Note with title: ${title} not found!`));
        return
    }

    saveNotes(notesWithoutTitle);
    console.log(chalk.green(`Note with title: ${title} removed!`));
}

function listNotes() {
    console.log(chalk.yellow("Your notes:"));

    const notes = loadNotes();
    notes.forEach(note => console.log("\t -" + note.title));
}

function readNote(title) {
    const notes = loadNotes();
    const found = notes.find(note => note.title === title);

    if (found === undefined) {
        console.log(chalk.red(`Note not found! Title: ${title}`));
    }
    else {
        console.log(chalk.yellow(`Title: ${found.title}`));
        console.log('----------');
        console.log(found.body);
        console.log('----------');
    }
}

function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync(FILENAME);
        return JSON.parse(dataBuffer.toString());
    }
    catch (e) {
        console.log(`Failed to load file ${FILENAME}`);
        return [];
    }
}
function saveNotes(notes) {
    try {
        const dataJSON = JSON.stringify(notes);
        fs.writeFileSync(FILENAME, dataJSON);
    }
    catch (e) {
        console.log(`Failed to write to file ${FILENAME}`);
    }
}

module.exports = {addNote, removeNote, listNotes, readNote};