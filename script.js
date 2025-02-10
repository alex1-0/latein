document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const switchToDictionary = document.getElementById('switchToDictionary');
    const switchToQuery = document.getElementById('switchToQuery');
    const dictionarySection = document.getElementById('dictionarySection');
    const querySection = document.getElementById('querySection');
    const latinWordInput = document.getElementById('latinWord');
    const stemFormsInput = document.getElementById('stemForms');
    const translationsInput = document.getElementById('translations');
    const saveWordButton = document.getElementById('saveWord');
    const searchInput = document.getElementById('search');
    const wordList = document.getElementById('wordList');
    const queryLatinWordInput = document.getElementById('queryLatinWord');
    const queryStemFormsInput = document.getElementById('queryStemForms');
    const queryTranslationsInput = document.getElementById('queryTranslations');
    const checkAnswerButton = document.getElementById('checkAnswer');
    const resultDiv = document.getElementById('result');

    let words = JSON.parse(localStorage.getItem('words')) || [];

    // Dark Mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Switch between sections
    switchToDictionary.addEventListener('click', () => {
        dictionarySection.classList.add('active');
        querySection.classList.remove('active');
    });

    switchToQuery.addEventListener('click', () => {
        querySection.classList.add('active');
        dictionarySection.classList.remove('active');
    });

    // Save word
    saveWordButton.addEventListener('click', () => {
        const latinWord = latinWordInput.value.trim();
        const stemForms = stemFormsInput.value.trim();
        const translations = translationsInput.value.trim();

        if (latinWord && stemForms && translations) {
            words.push({ latinWord, stemForms, translations });
            localStorage.setItem('words', JSON.stringify(words));
            updateWordList();
            latinWordInput.value = '';
            stemFormsInput.value = '';
            translationsInput.value = '';
        }
    });

    // Update word list
    function updateWordList() {
        wordList.innerHTML = '';
        words.forEach((word, index) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-item';
            wordDiv.innerHTML = `
                <strong>${word.latinWord}</strong>: ${word.stemForms} - ${word.translations}
                <button onclick="deleteWord(${index})">Löschen</button>
            `;
            wordList.appendChild(wordDiv);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredWords = words.filter(word => 
            word.latinWord.toLowerCase().includes(searchTerm) || 
            word.stemForms.toLowerCase().includes(searchTerm) || 
            word.translations.toLowerCase().includes(searchTerm)
        );
        wordList.innerHTML = '';
        filteredWords.forEach((word, index) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-item';
            wordDiv.innerHTML = `
                <strong>${word.latinWord}</strong>: ${word.stemForms} - ${word.translations}
                <button onclick="deleteWord(${index})">Löschen</button>
            `;
            wordList.appendChild(wordDiv);
        });
    });

    // Delete word
    window.deleteWord = function(index) {
        words.splice(index, 1);
        localStorage.setItem('words', JSON.stringify(words));
        updateWordList();
    };

    // Check answer
    checkAnswerButton.addEventListener('click', () => {
