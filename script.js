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

    let vocabulary = [];

    // Navigation zwischen den Feldern mit Enter
    latinWordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            stemFormsInput.focus();
        }
    });

    stemFormsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            translationsInput.focus();
        }
    });

    translationsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveWord();
        }
    });

    // Vokabel speichern
    function saveWord() {
        const latinWord = latinWordInput.value.trim();
        const stemForms = stemFormsInput.value.trim();
        const translations = translationsInput.value.trim();

        if (latinWord && stemForms && translations) {
            vocabulary.push({ latinWord, stemForms, translations });
            displayVocabulary();
            latinWordInput.value = '';
            stemFormsInput.value = '';
            translationsInput.value = '';
            latinWordInput.focus();
        }
    }

    saveWordButton.addEventListener('click', saveWord);

    // Vokabeln anzeigen
    function displayVocabulary() {
        vocabularyList.innerHTML = '';
        vocabulary.forEach((word, index) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'vocabulary-item';
            wordDiv.innerHTML = `
                <strong>${word.latinWord}</strong>: ${word.stemForms} - ${word.translations}
            `;
            vocabularyList.appendChild(wordDiv);
        });
    }

    // Live-Suche
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredVocabulary = vocabulary.filter(word => 
            word.latinWord.toLowerCase().includes(searchTerm) || 
            word.stemForms.toLowerCase().includes(searchTerm) || 
            word.translations.toLowerCase().includes(searchTerm)
        );
        displayFilteredVocabulary(filteredVocabulary);
    });

    function displayFilteredVocabulary(filteredVocabulary) {
        vocabularyList.innerHTML = '';
        filteredVocabulary.forEach((word, index) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'vocabulary-item';
            wordDiv.innerHTML = `
                <strong>${word.latinWord}</strong>: ${word.stemForms} - ${word.translations}
            `;
            vocabularyList.appendChild(wordDiv);
        });
    }

    // Abfrage
    let currentWordIndex = 0;

    function nextWord() {
        if (vocabulary.length > 0) {
            currentWordIndex = Math.floor(Math.random() * vocabulary.length);
            queryLatinWordInput.value = vocabulary[currentWordIndex].latinWord;
            queryStemFormsInput.value = '';
            queryTranslationsInput.value = '';
            resultDiv.textContent = '';
            queryStemFormsInput.focus();
        }
    }

    checkAnswerButton.addEventListener('click', function() {
        const stemForms = queryStemFormsInput.value.trim();
        const translations = queryTranslationsInput.value.trim();
        const correctStemForms = vocabulary[currentWordIndex].stemForms;
        const correctTranslations = vocabulary[currentWordIndex].translations;

        if (stemForms === correctStemForms && translations === correctTranslations) {
            resultDiv.textContent = 'Richtig!';
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = 'Falsch!';
            resultDiv.style.color = 'red';
        }
    });

    queryStemFormsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            queryTranslationsInput.focus();
        }
    });

    queryTranslationsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            checkAnswerButton.click();
        }
    });

    nextWord();
});
