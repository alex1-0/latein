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

    // Enter-Taste in den Eingabefeldern
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
        const filteredVokabeln = vokabeln.filter(v => v.vokabel.toLowerCase().includes(searchTerm));

        vokabelList.innerHTML = '';
        filteredVokabeln.forEach((v, index) => {
            const vokabelItem = document.createElement('div');
            vokabelItem.className = 'vokabel-item';
            vokabelItem.innerHTML = `
                <span><strong>${v.vokabel}</strong> - ${v.stammformen} - ${v.uebersetzungen}</span>
                <div class="actions">
                    <button onclick="editVokabel(${index})">Bearbeiten</button>
                    <button onclick="deleteVokabel(${index})">Löschen</button>
                </div>
            `;
            vokabelList.appendChild(vokabelItem);
        });
    }

    // Vokabel bearbeiten
    window.editVokabel = function(index) {
        const vokabel = vokabeln[index];
        vokabelInput.value = vokabel.vokabel;
        stammformenInput.value = vokabel.stammformen;
        uebersetzungenInput.value = vokabel.uebersetzungen;
        vokabeln.splice(index, 1);
        localStorage.setItem('vokabeln', JSON.stringify(vokabeln));
        renderVokabeln(vokabeln);
    };

    // Vokabel löschen
    window.deleteVokabel = function(index) {
        vokabeln.splice(index, 1);
        localStorage.setItem('vokabeln', JSON.stringify(vokabeln));
        renderVokabeln(vokabeln);
    };

    // Dark Mode umschalten
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    });
// Vokabeln exportieren
exportBtn.addEventListener('click', function() {
    const dataStr = JSON.stringify(vokabeln, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vokabeln.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Vokabeln importieren
importBtn.addEventListener('click', function() {
    importFile.click();
});

importFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            try {
                const importedVokabeln = JSON.parse(contents);
                vokabeln = importedVokabeln;
                localStorage.setItem('vokabeln', JSON.stringify(vokabeln));
                renderVokabeln(vokabeln);
            } catch (error) {
                alert('Fehler beim Importieren der Datei. Stellen Sie sicher, dass es sich um eine gültige JSON-Datei handelt.');
            }
        };
        reader.readAsText(file);
    }
});
