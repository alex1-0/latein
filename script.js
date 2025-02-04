document.addEventListener('DOMContentLoaded', function() {
    const vokabelInput = document.getElementById('vokabel');
    const stammformenInput = document.getElementById('stammformen');
    const uebersetzungenInput = document.getElementById('uebersetzungen');
    const saveBtn = document.getElementById('save-btn');
    const searchInput = document.getElementById('search');
    const vokabelList = document.getElementById('vokabel-list');
    const themeToggle = document.getElementById('theme-toggle');

    let vokabeln = [];

    // Vokabeln von GitHub laden
    async function loadVokabeln() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/alex1-0/alex1-0.github.io/main/latein/vokabeln.json');
            vokabeln = await response.json();
            renderVokabeln();
        } catch (error) {
            console.error("Fehler beim Laden der Vokabeln:", error);
        }
    }

    loadVokabeln();

    saveBtn.addEventListener('click', saveVokabel);

    function saveVokabel() {
        const vokabel = vokabelInput.value.trim();
        const stammformen = stammformenInput.value.trim();
        const uebersetzungen = uebersetzungenInput.value.trim();

        if (vokabel && stammformen && uebersetzungen) {
            vokabeln.push({ vokabel, stammformen, uebersetzungen });
            updateVokabelnJson();
            vokabelInput.value = '';
            stammformenInput.value = '';
            uebersetzungenInput.value = '';
            renderVokabeln();
        }
    }

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
        updateVokabelnJson();
        renderVokabeln();
    };

    window.deleteVokabel = function(index) {
        vokabeln.splice(index, 1);
        updateVokabelnJson();
        renderVokabeln();
    };

    function updateVokabelnJson() {
        fetch('https://api.github.com/repos/alex1-0/alex1-0.github.io/contents/latein/vokabeln.json', {
            method: 'PUT',
            headers: {
                'Authorization': 'token GITHUB_PERSONAL_ACCESS_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Update vokabeln.json",
                content: btoa(JSON.stringify(vokabeln, null, 2)),
                sha: 'LATEST_SHA' // Wird durch GitHub Actions ersetzt
            })
        }).then(response => response.json())
          .then(data => console.log("Vokabeln aktualisiert:", data))
          .catch(error => console.error("Fehler beim Speichern:", error));
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });
});
