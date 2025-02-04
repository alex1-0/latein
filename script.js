document.addEventListener('DOMContentLoaded', function() {
    const vokabelInput = document.getElementById('vokabel');
    const stammformenInput = document.getElementById('stammformen');
    const uebersetzungenInput = document.getElementById('uebersetzungen');
    const saveBtn = document.getElementById('save-btn');
    const searchInput = document.getElementById('search');
    const vokabelList = document.getElementById('vokabel-list');
    const themeToggle = document.getElementById('theme-toggle');

    const vokabelnFilePath = 'vokabeln.json'; // Pfad zur JSON-Datei

    // Beim Laden der Seite Vokabeln vom Server abrufen
    fetchVokabeln();

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

    // Vokabeln vom Server abrufen
    async function fetchVokabeln() {
        try {
            const response = await fetch(vokabelnFilePath);
            const data = await response.json();
            renderVokabeln(data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Vokabeln:', error);
        }
    }

    // Neue Vokabel speichern
    async function saveVokabel() {
        const vokabel = vokabelInput.value.trim();
        const stammformen = stammformenInput.value.trim();
        const uebersetzungen = uebersetzungenInput.value.trim();

        if (vokabel && stammformen && uebersetzungen) {
            try {
                // Aktuelle Vokabeln laden
                const response = await fetch(vokabelnFilePath);
                const vokabeln = await response.json();

                // Neue Vokabel hinzufügen
                vokabeln.push({ vokabel, stammformen, uebersetzungen });

                // Vokabeln zurück auf den Server speichern
                await fetch(vokabelnFilePath, {
                    method: 'POST', // POST-Anfrage zum Speichern
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vokabeln),
                });

                // Felder leeren und Fokus setzen
                vokabelInput.value = '';
                stammformenInput.value = '';
                uebersetzungenInput.value = '';
                vokabelInput.focus();

                // Vokabeln neu laden
                fetchVokabeln();
            } catch (error) {
                console.error('Fehler beim Speichern der Vokabel:', error);
            }
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
    window.editVokabel = async function(index) {
        try {
            // Aktuelle Vokabeln laden
            const response = await fetch(vokabelnFilePath);
            const vokabeln = await response.json();

            // Vokabel bearbeiten
            const vokabel = vokabeln[index];
            vokabelInput.value = vokabel.vokabel;
            stammformenInput.value = vokabel.stammformen;
            uebersetzungenInput.value = vokabel.uebersetzungen;

            // Vokabel aus der Liste entfernen
            vokabeln.splice(index, 1);

            // Vokabeln zurück auf den Server speichern
            await fetch(vokabelnFilePath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vokabeln),
            });

            // Vokabeln neu laden
            fetchVokabeln();
        } catch (error) {
            console.error('Fehler beim Bearbeiten der Vokabel:', error);
        }
    };

    // Vokabel löschen
    window.deleteVokabel = async function(index) {
        try {
            // Aktuelle Vokabeln laden
            const response = await fetch(vokabelnFilePath);
            const vokabeln = await response.json();

            // Vokabel löschen
            vokabeln.splice(index, 1);

            // Vokabeln zurück auf den Server speichern
            await fetch(vokabelnFilePath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vokabeln),
            });

            // Vokabeln neu laden
            fetchVokabeln();
        } catch (error) {
            console.error('Fehler beim Löschen der Vokabel:', error);
        }
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
});
