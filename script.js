document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const button = document.getElementById("toggleBtn");
    const icon = document.getElementById("themeIcon");

    // Переключение темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add("dark-mode");
        icon.src = "sun.svg";
    }

    button.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        icon.src = isDark ? "sun.svg" : "moon.svg";
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Работа с заметками
    const notesTextarea = document.getElementById('notesTextarea');
    const saveBtn = document.getElementById('saveNote');
    const clearBtn = document.getElementById('clearNote');
    const notesList = document.getElementById('notesList');

    function loadNotes() {
        return JSON.parse(localStorage.getItem('notes') || '[]');
    }

    function saveNotes(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function renderNotes() {
        notesList.innerHTML = '';
        const notes = loadNotes();

        notes.forEach((note, index) => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';
            noteDiv.innerHTML = `
                <p>${note}</p>
                <button class="delete-note" title="Удалить" data-index="${index}">&times;</button>
            `;
            notesList.appendChild(noteDiv);
        });
    }

    saveBtn.addEventListener('click', () => {
        const text = notesTextarea.value.trim();
        if (text !== '') {
            const notes = loadNotes();
            notes.unshift(text); // Добавляем в начало списка
            saveNotes(notes);
            notesTextarea.value = '';
            notesTextarea.style.height = 'auto'; // Сброс высоты
            renderNotes();
        }
    });

    notesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-note')) {
            const index = e.target.dataset.index;
            const notes = loadNotes();
            notes.splice(index, 1);
            saveNotes(notes);
            renderNotes();
        }
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Очистить все заметки?')) {
            localStorage.removeItem('notes');
            renderNotes();
        }
    });

    // Автоувеличение высоты textarea
    notesTextarea.addEventListener('input', () => {
        notesTextarea.style.height = 'auto'; // Сброс высоты
        notesTextarea.style.height = notesTextarea.scrollHeight + 'px'; // Новая высота
    });

    renderNotes(); // Инициализация при загрузке
});

// Автоувеличение высоты textarea
function autoResizeTextarea() {
    notesTextarea.style.height = 'auto'; // Сброс
    notesTextarea.style.height = Math.min(notesTextarea.scrollHeight, 200) + 'px'; // Ограничение до 200px
}

notesTextarea.addEventListener('input', autoResizeTextarea);

// Вызываем один раз при загрузке, чтобы установить корректную высоту
document.addEventListener('DOMContentLoaded', autoResizeTextarea);
