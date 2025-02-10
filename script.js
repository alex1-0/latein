// Supabase-Initialisierung
const { createClient } = supabase;

const supabaseUrl = 'https://idctfmiogiwvoeycpeex.supabase.co'; // Ersetze dies durch deine Supabase-URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkY3RmbWlvZ2l3dm9leWNwZWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMzY0NzIsImV4cCI6MjA1NDcxMjQ3Mn0.hlArMKgccYDtZJcgjjvhU1yeu_hWY1soYZD8lKLDL10'; // Ersetze dies durch deinen Supabase-API-Key
const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('Supabase Client initialisiert:', supabaseClient);

// Elemente
const dictionarySection = document.getElementById('dictionarySection');
const querySection = document.getElementById('querySection');
const toggleDictionaryButton = document.getElementById('toggleDictionary');
const toggleQueryButton = document.getElementById('toggleQuery');
const latinWordInput = document.getElementById('latinWord');
const stemFormsInput = document.getElementById('stemForms');
const translationsInput = document.getElementById('translations');
const saveWordButton = document.getElementById('saveWord');
const searchInput = document.getElementById('search');
const vocabularyList = document.getElementById('vocabularyList');
const queryLatinWordInput = document.getElementById('queryLatinWord');
const queryStemFormsInput = document.getElementById('queryStemForms');
const queryTranslationsInput = document.getElementById('queryTranslations');
const checkAnswerButton = document.getElementById('checkAnswer');
const resultDiv = document.getElementById('result');
const toggleDarkModeButton = document.getElementById('toggleDarkMode');

let vocabulary = [];

// Dark Mode
const isDarkMode = localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark-mode', isDarkMode);
toggleDarkModeButton.textContent = isDarkMode ? '🌞' : '🌙';

toggleDarkModeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggleDarkModeButton.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('darkMode', isDark);
});

// Navigation
toggleDictionaryButton.addEventListener('click', () => {
    dictionarySection.classList.remove('hidden');
    querySection.classList.add('hidden');
    toggleQueryButton.style.order = '1';
    toggleDictionaryButton.style.order = '0';
});

toggleQueryButton.addEventListener('click', () => {
    if (vocabulary.length === 0) {
        alert('Bitte füge zuerst Vokabeln im Wörterbuch hinzu.');
        return;
    }
    dictionarySection.classList.add('hidden');
    querySection.classList.remove('hidden');
    toggleQueryButton.style.order = '0';
    toggleDictionaryButton.style.order = '1';
    generateQuery();
});

// Enter-Navigation
latinWordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') stemFormsInput.focus();
});

stemFormsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') translationsInput.focus();
});

translationsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveWord();
        latinWordInput.focus();
    }
});

queryStemFormsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') queryTranslationsInput.focus();
});

queryTranslationsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Vokabeln laden
async function loadVocabulary() {
    const { data, error } = await supabaseClient
        .from('vocabulary')
        .select('*');
    if (error) {
        console.error('Fehler beim Laden der Vokabeln:', error);
        return;
    }
    vocabulary = data;
    renderVocabulary();
}

// Vokabel speichern
async function saveWord() {
    const latin = latinWordInput.value.trim();
    const stem = stemFormsInput.value.trim();
    const translation = translationsInput.value.trim();
    if (latin && stem && translation) {
        const { data, error } = await supabaseClient
            .from('vocabulary')
            .insert([{ latin, stem, translation }]);
        if (error) {
            console.error('Fehler beim Speichern der Vokabel:', error);
            return;
        }
        latinWordInput.value = '';
        stemFormsInput.value = '';
        translationsInput.value = '';
        loadVocabulary();
    }
}

// Vokabeln anzeigen
function renderVocabulary() {
    vocabularyList.innerHTML = '';
    vocabulary.forEach((word) => {
        const item = document.createElement('div');
        item.className = 'vocabulary-item';
        item.innerHTML = `
            <span>${word.latin} - ${word.stem} - ${word.translation}</span>
            <div class="actions">
                <button class="edit" onclick="editWord('${word.id}')">Bearbeiten</button>
                <button onclick="deleteWord('${word.id}')">Löschen</button>
            </div>
        `;
        vocabularyList.appendChild(item);
    });
}

// Vokabel bearbeiten
async function editWord(id) {
    const word = vocabulary.find((w) => w.id === id);
    latinWordInput.value = word.latin;
    stemFormsInput.value = word.stem;
    translationsInput.value = word.translation;
    await deleteWord(id);
}

// Vokabel löschen
async function deleteWord(id) {
    const { error } = await supabaseClient
        .from('vocabulary')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Fehler beim Löschen der Vokabel:', error);
        return;
    }
    loadVocabulary();
}

// Abfrage generieren
function generateQuery() {
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    queryLatinWordInput.value = randomWord.latin;
    queryStemFormsInput.value = '';
    queryTranslationsInput.value = '';
    resultDiv.textContent = '';
}

// Antwort überprüfen
function checkAnswer() {
    const latin = queryLatinWordInput.value.trim();
    const stem = queryStemFormsInput.value.trim();
    const translation = queryTranslationsInput.value.trim();
    const word = vocabulary.find((w) => w.latin === latin);
    if (word && word.stem === stem && word.translation === translation) {
        resultDiv.textContent = 'Richtig!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = 'Falsch!';
        resultDiv.style.color = 'red';
    }
}

// Event-Listener
saveWordButton.addEventListener('click', saveWord);
checkAnswerButton.addEventListener('click', checkAnswer);

// Initialisierung
loadVocabulary();
