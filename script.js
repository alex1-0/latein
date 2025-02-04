document.addEventListener('DOMContentLoaded', function() {
    const vokabelInput = document.getElementById('vokabel');
    const stammformenInput = document.getElementById('stammformen');
    const uebersetzungenInput = document.getElementById('uebersetzungen');
    const saveBtn = document.getElementById('save-btn');
    const searchInput = document.getElementById('search');
    const vokabelList = document.getElementById('vokabel-list');
    const themeToggle = document.getElementById('theme-toggle');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    let vokabeln = JSON.parse(localStorage.getItem('vokabeln')) || [];

    // Beim Laden der Seite Vokabeln anzeigen
    renderVokabeln(vokabeln);

    vokabelInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            stammformenInput.focus();
        }
    });

    stammformenInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            uebersetzungenInput.focus();
        }
    });

    uebersetzungenInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveVokabel();
        }
    });

    saveBtn.addEventListener('click', saveVokabel);

    // Neue Vokabel speichern
    function saveVokabel() {
        const vokabel = vokabelInput.value.trim();
        const stammformen = stammformenInput.value.trim();
        const uebersetzungen = uebersetzungenInput.value.trim();

        if (vokabel && stammformen && uebersetzungen) {
            vokabeln.push({ vokabel, stammformen, uebersetzungen });
            localStorage.setItem('vokabeln', JSON.stringify(vokabeln));
            vokabelInput.value = '';
            stammformenInput.value = '';
            uebersetzungenInput.value = '';
            vokabelInput.focus();
            renderVokabeln(vokabeln);
        }
    }

    // Vokabeln anzeigen
    function renderVokabeln(vokabeln) {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredVokabeln = vokabeln.filter
