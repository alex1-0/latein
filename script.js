// Supabase Initialisierung
const supabaseUrl = 'https://idctfmiogiwvoeycpeex.supabase.co'; // Ersetze dies durch deine Supabase-URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkY3RmbWlvZ2l3dm9leWNwZWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMzY0NzIsImV4cCI6MjA1NDcxMjQ3Mn0.hlArMKgccYDtZJcgjjvhU1yeu_hWY1soYZD8lKLDL10'; // Ersetze dies durch deinen Supabase-API-Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    const latinWordInput = document.getElementById('latin-word');
    const stemFormsInput = document.getElementById('stem-forms');
    const translationsInput = document.getElementById('translations');
    const saveWordButton = document.getElementById('save-word');
    const searchInput = document.getElementById('search');
    const vocabularyList = document.getElementById('vocabulary-list');
    const queryLatinWordInput = document.getElementById('query-latin-word');
    const queryStemFormsInput = document.getElementById('query-stem-forms');
    const queryTranslationsInput = document.getElementById('query-translations');
    const checkAnswerButton = document.getElementById('check-answer');
    const resultDiv = document.getElementById('result');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    const showDictionaryButton = document.getElementById('show-dictionary');
    const showQueryButton = document.getElementById('show-query');
    const dictionarySection = document.getElementById('dictionary-section');
    const querySection = document.getElementById('query-section');

    let vocabulary = [];
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Dark Mode initialisieren
    document.body.classList.toggle('dark-mode', isDarkMode);
    toggleDarkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';

    // Dark Mode umschalten
    toggleDarkModeButton.addEventListener('click', function () {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        toggleDarkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Abschnitte wechseln
    showDictionaryButton.addEventListener('click', function () {
        dictionarySection.style.display = 'block';
        querySection.style.display = 'none';
    });

    showQueryButton.addEventListener('click', function () {
        dictionarySection.style.display = 'none';
        querySection.style.display = 'block';
        nextWord();
    });

    // Navigation zwischen den Feldern mit Enter
    latinWordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            stemFormsInput.focus();
        }
    });

    stemFormsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            translationsInput.focus();
        }
    });

    translationsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveWord();
        }
    });

    // Vokabel speichern
    async function saveWord() {
        const latinWord = latinWordInput.value.trim();
        const stemForms = stemFormsInput.value.trim();
        const translations = translationsInput.value.trim();

        if (latinWord && stemForms && translations) {
            const { data, error } = await supabase
                .from('vocabulary')
                .insert([{ latin_word: latinWord, stem_forms: stemForms, translations: translations }])
                .select();

            if (error) {
                console.error('Fehler beim Speichern der Vokabel:', error);
            } else {
                vocabulary.push(data[0]); // Füge die gespeicherte Vokabel hinzu
                displayVocabulary();
                latinWordInput.value = '';
                stemFormsInput.value = '';
                translationsInput.value = '';
                latinWordInput.focus();
            }
        }
    }

    saveWordButton.addEventListener('click', saveWord);

    // Vokabeln anzeigen
    function displayVocabulary() {
        vocabularyList.innerHTML = '';
        vocabulary.forEach((word) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'vocabulary-item';
            wordDiv.innerHTML = `
                <strong>${word.latin_word}</strong>: ${word.stem_forms} - ${word.translations}
            `;
            vocabularyList.appendChild(wordDiv);
        });
    }

    // Live-Suche
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredVocabulary = vocabulary.filter(word =>
            word.latin_word.toLowerCase().includes(searchTerm) ||
            word.stem_forms.toLowerCase().includes(searchTerm) ||
            word.translations.toLowerCase().includes(searchTerm)
        );
        displayFilteredVocabulary(filteredVocabulary);
    });

    function displayFilteredVocabulary(filteredVocabulary) {
        vocabularyList.innerHTML = '';
        filteredVocabulary.forEach((word) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'vocabulary-item';
            wordDiv.innerHTML = `
                <strong>${word.latin_word}</strong>: ${word.stem_forms} - ${word.translations}
            `;
            vocabularyList.appendChild(wordDiv);
        });
    }

    // Abfrage
    let currentWordIndex = 0;

    function nextWord() {
        if (vocabulary.length > 0) {
            currentWordIndex = Math.floor(Math.random() * vocabulary.length);
            queryLatinWordInput.value = vocabulary[currentWordIndex].latin_word;
            queryStemFormsInput.value = '';
            queryTranslationsInput.value = '';
            resultDiv.textContent = '';
            queryStemFormsInput.focus();
        }
    }

    checkAnswerButton.addEventListener('click', function () {
        const stemForms = queryStemFormsInput.value.trim();
        const translations = queryTranslationsInput.value.trim();
        const correctStemForms = vocabulary[currentWordIndex].stem_forms;
        const correctTranslations = vocabulary[currentWordIndex].translations;

        if (stemForms === correctStemForms && translations === correctTranslations) {
            resultDiv.textContent = 'Richtig!';
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = 'Falsch!';
            resultDiv.style.color = 'red';
        }
    });

    queryStemFormsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            queryTranslationsInput.focus();
        }
    });

    queryTranslationsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAnswerButton.click();
        }
    });

    // Vokabeln beim Laden der Seite abrufen
    async function loadVocabulary() {
        const { data, error } = await supabase
            .from('vocabulary')
            .select('*');

        if (error) {
            console.error('Fehler beim Laden der Vokabeln:', error);
        } else {
            vocabulary = data;
            displayVocabulary();
        }
    }

    // Initialisierung
    loadVocabulary();
});
