// Global Variables
let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let darkMode = localStorage.getItem('darkMode') === 'enabled';

// DOM Elements
const dictionarySection = document.getElementById('dictionarySection');
const quizSection = document.getElementById('quizSection');
const darkModeToggle = document.getElementById('darkModeToggle');
const switchToDictionary = document.getElementById('switchToDictionary');
const switchToQuiz = document.getElementById('switchToQuiz');
const latinWordInput = document.getElementById('latinWord');
const stemFormsInput = document.getElementById('stemForms');
const translationsInput = document.getElementById('translations');
const searchVocabularyInput = document.getElementById('searchVocabulary');
const vocabularyList = document.getElementById('vocabularyList');
const quizWord = document.getElementById('quizWord');
const quizStemFormsInput = document.getElementById('quizStemForms');
const quizTranslationsInput = document.getElementById('quizTranslations');
const quizResult = document.getElementById('quizResult');

// Functions
function renderVocabulary() {
  vocabularyList.innerHTML = '';
  const searchQuery = searchVocabularyInput.value.toLowerCase();
  
  vocabulary
    .filter(item => item.latin.toLowerCase().includes(searchQuery))
    .forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.latin} - ${item.stemForms} - ${item.translations}`;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';
      
      const editButton = document.createElement('button');
      editButton.textContent = 'Bearbeiten';
      editButton.onclick = () => editVocabulary(index);
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Löschen';
      deleteButton.onclick = () => deleteVocabulary(index);
      
      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);
      
      li.appendChild(actionsDiv);
      vocabularyList.appendChild(li);
    });
}

function saveVocabulary() {
  const latinWord = latinWordInput.value.trim();
  const stemForms = stemFormsInput.value.trim();
  const translations = translationsInput.value.trim();
  
  if (latinWord && stemForms && translations) {
    vocabulary.push({ latin: latinWord, stemForms, translations });
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    renderVocabulary();
    
    latinWordInput.value = '';
    stemFormsInput.value = '';
    translationsInput.value = '';
    latinWordInput.focus();
  }
}

function editVocabulary(index) {
  const item = vocabulary[index];
  
  latinWordInput.value = item.latin;
  stemFormsInput.value = item.stemForms;
  translationsInput.value = item.translations;

  deleteVocabulary(index);
}

function deleteVocabulary(index) {
  vocabulary.splice(index, 1);
  localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
  renderVocabulary();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  
  if (darkMode) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Event Listeners
translationsInput.addEventListener('keypress', e => {
 if (e.key === 'Enter') saveVocabulary();
});

searchVocabularyInput.addEventListener('input', renderVocabulary);

darkModeToggle.addEventListener('click', toggleDarkMode);

switchToDictionary.addEventListener('click', () => {
 dictionarySection.classList.remove('hidden');
 quizSection.classList.add('hidden');
});

switchToQuiz.addEventListener('click', () => {
 dictionarySection.classList.add('hidden');
 quizSection.classList.remove('hidden');

 // Load random word for quiz
 if (vocabulary.length > 0) {
   const randomIndex = Math.floor(Math.random() * vocabulary.length);
   const wordForQuiz = vocabulary[randomIndex];
   quizWord.textContent = `Wort: ${wordForQuiz.latin}`;
   quizStemFormsInput.dataset.correctAnswer =
     wordForQuiz.stemForms.toLowerCase();
   quizTranslationsInput.dataset.correctAnswer =
     wordForQuiz.translations.toLowerCase();
 }
});

quizTranslationsInput.addEventListener("keypress", (e) => {
 if (e.key === "Enter") {
   const correctStem =
     quizStemFormsInput.dataset.correctAnswer ===
     quizStemFormsInput.value.toLowerCase();
   const correctTranslation =
     quizTranslationsInput.dataset.correctAnswer ===
     quizTranslationsInput.value.toLowerCase();

   quizResult.textContent =
     correctStem && correctTranslation ? "Richtig!" : "Falsch!";
 }
});

// Initial Setup
if (darkMode) toggleDarkMode();

renderVocabulary();
