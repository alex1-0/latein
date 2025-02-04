document.addEventListener('DOMContentLoaded', function() {
    const vokabelInput = document.getElementById('vokabel');
    const stammformenInput = document.getElementById('stammformen');
    const uebersetzungenInput = document.getElementById('uebersetzungen');
    const saveBtn = document.getElementById('save-btn');
    const searchInput = document.getElementById('search');
    const vokabelList = document.getElementById('vokabel-list');
    const themeToggle = document.getElementById('theme-toggle');

    let vokabeln = JSON.parse(localStorage.getItem('vokabeln')) || [];

    // Beim Laden der Seite die gespeicherten Vokabeln anzeigen
    renderVokabeln();

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

    function saveVokabel() {
        const vokabel = vokabelInput.value.trim();
        const stammformen = stammformenInput.value.trim();
        const uebersetzungen = uebersetzungenInput.value.trim();

        if (vokabel && stammformen && uebersetzungen) {
            vokabeln.push({ vokabel, stammformen, uebersetzungen });
            localStorage.setItem('vokabeln', JSON.stringify(vokabeln)); // Speichern in LocalStorage
            vokabelInput.value = '';
            stammformenInput.value = '';
            uebersetzungenInput.value = '';
            vokabelInput.focus();
            renderVokabeln();
        }
    }

    searchInput.addEventListener('input', function() {
        renderVokabeln();
    });

    function renderVokabeln() {
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

    window.editVokabel = function(index) {
        const vokabel = vokabeln[index];
        vokabelInput.value = vokabel.vokabel;
        stammformenInput.value = vokabel.stammformen;
        uebersetzungenInput.value = vokabel.uebersetzungen;
        vokabeln.splice(index, 1);
        localStorage.setItem('vokabeln', JSON.stringify(vokabeln)); // Aktualisieren in LocalStorage
        renderVokabeln();
    };

    window.deleteVokabel = function(index) {
        vokabeln.splice(index, 1);
        localStorage.setItem('vokabeln', JSON.stringify(vokabeln)); // Aktualisieren in LocalStorage
        renderVokabeln();
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
