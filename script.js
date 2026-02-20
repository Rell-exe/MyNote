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

    notes.unshift(newNote); // Menambahkan catatan baru di paling atas
    saveNotes(notes);
    input.value = "";
    loadNotes();
}

// Memisahkan fungsi render agar bisa dipakai ulang oleh pencarian
function renderNotes(notesToRender) {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    if (notesToRender.length === 0) {
        container.innerHTML = `<div class="empty-state">Belum ada catatan yang ditemukan.</div>`;
        return;
    }

    notesToRender.forEach(note => {
        const div = document.createElement("div");
        div.className = "note";

        // Mencegah XSS ringan dengan escapeHTML (opsional namun disarankan)
        const safeContent = note.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        div.innerHTML = `
            <div class="note-content">${safeContent}</div>
            <div class="note-time">🕒 ${note.createdAt}</div>
            <div class="actions">
                <button onclick="editNote(${note.id})">✏️ Edit</button>
                <button class="delete" onclick="deleteNote(${note.id})">🗑️ Hapus</button>
            </div>
        `;

        container.appendChild(div);
    });
}

function loadNotes() {
    renderNotes(getNotes());
}

function deleteNote(id) {
    // Menambahkan konfirmasi sebelum menghapus
    if (confirm("Apakah kamu yakin ingin menghapus catatan ini?")) {
        let notes = getNotes();
        notes = notes.filter(note => note.id !== id);
        saveNotes(notes);
        loadNotes();
    }
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

    renderNotes(filtered);
}

// Menangani Tema
const themeBtn = document.getElementById("toggleTheme");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon(isLight);
});

function loadTheme() {
    const theme = localStorage.getItem("theme");
    const isLight = theme === "light";
    
    if (isLight) {
        document.body.classList.add("light");
    }
    updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
    themeBtn.textContent = isLight ? "☀️" : "🌙";
}
