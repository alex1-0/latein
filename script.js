document.addEventListener("DOMContentLoaded", () => {
    const latinInput = document.getElementById("latinWord");
    const stemsInput = document.getElementById("stems");
    const translationsInput = document.getElementById("translations");
    const vocabList = document.getElementById("vocabList");
    const searchInput = document.getElementById("search");
    
    let vocabData = JSON.parse(localStorage.getItem("vocabData")) || [];

    function saveVocab() {
        localStorage.setItem("vocabData", JSON.stringify(vocabData));
    }

    function renderVocabList() {
        vocabList.innerHTML = "";
        vocabData.forEach((entry, index) => {
            const li = document.createElement("li");
            li.classList.add("vocab-item");
            li.innerHTML = `<span>${entry.latin} - ${entry.stems} - ${entry.translations}</span>
                            <div class="actions">
                                <button onclick="editVocab(${index})">✏️ Bearbeiten</button>
                                <button onclick="deleteVocab(${index})">🗑️ Löschen</button>
                            </div>`;
            vocabList.appendChild(li);
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (document.activeElement === translationsInput) {
                vocabData.push({
                    latin: latinInput.value,
                    stems: stemsInput.value,
                    translations: translationsInput.value
                });
                saveVocab();
                renderVocabList();
                latinInput.value = stemsInput.value = translationsInput.value = "";
                latinInput.focus();
            }
        }
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll(".vocab-item").forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(query) ? "block" : "none";
        });
    });

    renderVocabList();
});

function editVocab(index) {
    const newWord = prompt("Neues lateinisches Wort:", vocabData[index].latin);
    if (newWord) vocabData[index].latin = newWord;
    saveVocab();
    renderVocabList();
}

function deleteVocab(index) {
    vocabData.splice(index, 1);
    saveVocab();
    renderVocabList();
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}
