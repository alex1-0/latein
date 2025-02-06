document.addEventListener('DOMContentLoaded', function() {
    // Vorhandene Variablen
    const quizModeBtn = document.getElementById('quiz-mode-btn');
    const quizSection = document.querySelector('.quiz-section');
    const quizVokabel = document.getElementById('quiz-vokabel');
    const quizStamm = document.getElementById('quiz-stammformen');
    const quizUebersetzung = document.getElementById('quiz-uebersetzungen');
    const checkAnswerBtn = document.getElementById('check-answer');
    let currentQuiz = null;

    // 1. Suchfunktion korrigieren
    function renderVokabeln(vokabeln) {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredVokabeln = vokabeln.filter(v => 
            v.vokabel.toLowerCase().startsWith(searchTerm) // startsWith statt includes
        );
        // Rest unverändert
    }

    // 2. Abfragemodus
    quizModeBtn.addEventListener('click', function() {
        if (quizSection.style.display === 'none') {
            // Starte Abfragemodus
            currentQuiz = vokabeln[Math.floor(Math.random() * vokabeln.length)];
            quizVokabel.textContent = currentQuiz.vokabel;
            quizStamm.value = '';
            quizUebersetzung.value = '';
            quizSection.style.display = 'block';
            quizModeBtn.textContent = 'Zurück zum Wörterbuch';
        } else {
            // Beende Abfragemodus
            quizSection.style.display = 'none';
            quizModeBtn.textContent = 'Abfragemodus starten';
        }
    });

    checkAnswerBtn.addEventListener('click', function() {
        const isCorrect = 
            quizStamm.value.trim() === currentQuiz.stammformen &&
            quizUebersetzung.value.trim() === currentQuiz.uebersetzungen;
        
        alert(isCorrect ? 'Richtig! 🎉' : 'Leider falsch. 😢');
    });

    // 3. Query-Button Anpassung
    let isQueryMode = false;
    queryBtn.addEventListener('click', function() {
        if (!isQueryMode) {
            // Führe Abfrage durch
            const queryTerm = queryInput.value.trim().toLowerCase();
            const result = vokabeln.find(v => v.vokabel.toLowerCase() === queryTerm);
            // ... (existierende Abfragelogik)
            queryBtn.textContent = 'Zurück';
            isQueryMode = true;
        } else {
            // Zurück zur normalen Ansicht
            queryInput.value = '';
            queryResult.innerHTML = '';
            queryBtn.textContent = 'Abfragen';
            isQueryMode = false;
        }
    });
});
