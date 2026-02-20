document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    loadTheme();
});

function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote() {
    const input = document.getElementById("noteInput");
    const text = input.value.trim();

    if (!text) {
        alert("Catatan tidak boleh kosong!");
        return;
    }

    const notes = getNotes();
    const newNote = {
        id: Date.now(),
        content: text,
        createdAt: new Date().toLocaleString()
    };

    notes.unshift(newNote);
    saveNotes(notes);
    input.value = "";
    loadNotes();
}

function loadNotes() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    const notes = getNotes();

    notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";

        div.innerHTML = `
            <div>${note.content}</div>
            <div class="note-time">🕒 ${note.createdAt}</div>
            <div class="actions">
                <button onclick="editNote(${note.id})">Edit</button>
                <button class="delete" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        `;

        container.appendChild(div);
    });
}

function deleteNote(id) {
    let notes = getNotes();
    notes = notes.filter(note => note.id !== id);
    saveNotes(notes);
    loadNotes();
}

function editNote(id) {
    let notes = getNotes();
    const note = notes.find(n => n.id === id);

    const newContent = prompt("Edit catatan:", note.content);

    if (newContent !== null && newContent.trim() !== "") {
        note.content = newContent;
        note.createdAt = new Date().toLocaleString() + " (Diedit)";
        saveNotes(notes);
        loadNotes();
    }
}

function searchNotes() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const notes = getNotes();

    const filtered = notes.filter(note =>
        note.content.toLowerCase().includes(keyword)
    );

    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    filtered.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";
        div.innerHTML = `
            <div>${note.content}</div>
            <div class="note-time">🕒 ${note.createdAt}</div>
            <div class="actions">
                <button onclick="editNote(${note.id})">Edit</button>
                <button class="delete" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        `;
        container.appendChild(div);
    });
}

document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
        document.body.classList.add("light");
    }
}
