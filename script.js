document.addEventListener("DOMContentLoaded", loadNotes);

function addNote() {
    const input = document.getElementById("noteInput");
    const noteText = input.value.trim();

    if (noteText === "") {
        alert("Catatan tidak boleh kosong!");
        return;
    }

    const notes = getNotes();
    notes.push(noteText);
    localStorage.setItem("notes", JSON.stringify(notes));

    input.value = "";
    loadNotes();
}

function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function loadNotes() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    const notes = getNotes();

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note";
        div.innerHTML = `
            ${note}
            <button class="delete-btn" onclick="deleteNote(${index})">X</button>
        `;
        container.appendChild(div);
    });
}

function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}
