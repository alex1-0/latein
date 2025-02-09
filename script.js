document.addEventListener('DOMContentLoaded', function() {
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
    let isDarkMode = false;

    // Dark Mode umschalten
    toggleDarkModeButton.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        toggleDarkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    });

    // Abschnitte wechseln
    showDictionaryButton.addEventListener('click', function() {
        dictionarySection.style.display = 'block';
        querySection.style.display = 'none';
    });

    showQueryButton.addEventListener('click', function() {
        dictionarySection.style.display = 'none';
        querySection.style.display = 'block';
        nextWord();
    });

    // Rest des Codes (wie zuvor) ...
    // (Der restliche JavaScript-Code bleibt unverändert.)
});
