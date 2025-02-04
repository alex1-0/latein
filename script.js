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
