document.addEventListener('DOMContentLoaded', function() {
    const vokabelInput = document.getElementById('vokabel');
    const stammformenInput = document.getElementById('stammformen');
    const uebersetzungenInput = document.getElementById('uebersetzungen');
    const saveBtn = document.getElementById('save-btn');
    const searchInput = document.getElementById('search');
    const vokabelList = document.getElementById('vokabel-list');
    const themeToggle = document.getElementById('theme-toggle');

    const apiUrl = 'backend.js'; // Pfad zur backend.js-Datei

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

    async function fetchVokabeln() {
        try {
            const response = await fetch(`${apiUrl}?action=getVokabeln`);
            const data = await response.json();
            renderVokabeln(data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Vokabeln:', error);
        }
    }

    async function saveVokabel() {
        const vokabel = vokabelInput.value.trim();
        const stammformen = stammformenInput.value.trim();
        const uebersetzungen = uebersetzungenInput.value.trim();

        if (vokabel && stammformen && uebersetzungen) {
            try {
                await fetch(`${apiUrl}?action=addVokabel&vokabel=${vokabel}&stammformen=${stammformen}&uebersetzungen=${uebersetzungen}`);
                vokabelInput.value = '';
                stammformenInput.value = '';
                uebersetzungenInput.value = '';
                vokabelInput.focus();
                fetchVokabeln(); // Vokabeln neu laden
            } catch (error) {
                console.error('Fehler beim Speichern der Vokabel:', error);
            }
        }
    }

    searchInput.addEventListener('input', function() {
        fetchVokabeln();
    });

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
                    <button onclick="deleteVokabel(${index})">Löschen</button>
                </div>
            `;
            vokabelList.appendChild(vokabelItem);
        });
    }

    window.deleteVokabel = async function(index) {
        try {
            await fetch(`${apiUrl}?action=deleteVokabel&id=${index}`);
            fetchVokabeln(); // Vokabeln neu laden
        } catch (error) {
            console.error('Fehler beim Löschen der Vokabel:', error);
        }
    };

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    });
});
