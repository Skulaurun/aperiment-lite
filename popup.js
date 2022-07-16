let data = [];

// TODO: Sort by newest

const beginnerOverlay = document.getElementById("beginner-overlay");
const backButton = document.getElementById("back-to-overlay-button");

function setModpackId(id) {
    
    const viewModpackId = document.getElementById("modpack-id");
    viewModpackId.href = `https://www.skulaurun.eu/aperiment/modpacks/${id}`;
    viewModpackId.textContent = id;

    beginnerOverlay.style.display = "none";
    viewModpackId.parentElement.style.display = "block";
    backButton.parentElement.style.display = "block";

    // Firefox storage
    browser.storage.local.set({
        "modpackId": id
    });

}
async function loadModpackList(id) {

    const response = await request({
        method: "GET",
        url: `https://www.skulaurun.eu/aperiment/api/v1/modpacks/${id}`
    });
    if (response["status"] === 200) {
    
        const modpack = JSON.parse(response.body);
        setModpackId(modpack.globalId);
    
        // temp
        for (const mod of modpack.mods) {
            mod.name = mod.url.split("/").pop();
        }
    
        data = modpack.mods;
        renderTableData(data);
    
    }

}

backButton.addEventListener("click", (e) => {
    e.preventDefault();
    beginnerOverlay.style.display = "block";
    backButton.parentElement.style.display = "none";
});

beginnerOverlay.querySelector(".create-section button").addEventListener("click", async () => {

    const response = await request({
        method: "GET",
        url: "https://www.skulaurun.eu/aperiment/api/v1/modpacks/create"
    });

    if (response["status"] === 200) {
        const modpack = JSON.parse(response.body);
        setModpackId(modpack.globalId);
    }

});
beginnerOverlay.querySelector(".join-section button").addEventListener("click", async () => {
    const { value: inputValue } = beginnerOverlay.querySelector(".join-section input");
    loadModpackList(inputValue);
});

document.getElementById("mod-filter").addEventListener("keyup", function () {
    if (this.value == "") {
        renderTableData(data);
    } else {
        renderTableData(data.filter(x => x.name.toLowerCase().startsWith(this.value.toLowerCase())));
    }
});

function renderTableData(tableData, element = document.getElementById("mod-list")) {

    element.innerHTML = "";

    for (const entry of tableData) {

        const row = document.createElement("tr");
        const name = document.createElement("td");
        const url = document.createElement("a");
        url.setAttribute("target", "_blank");
        url.textContent = entry.name;
        url.href = entry.url;
        name.appendChild(url);

        const button = document.createElement("td");
        const link = document.createElement("a");
        link.addEventListener("click", async (e) => {

            e.preventDefault();

            try {

                let { modpackId } = await browser.storage.local.get("modpackId");

                const response = await request({
                    method: "POST",
                    url: `https://www.skulaurun.eu/aperiment/api/v1/modpacks/${modpackId}/remove`,
                    headers: {
                        "content-type": "application/json"
                    },
                    data: {
                        url: entry.url
                    }
                });

                if (response["status"] === 200) {
                    row.remove();
                    data = data.filter(x => x.url !== entry.url);
                }

            } catch {}

        });
        link.textContent = "X";

        row.appendChild(name);
        row.appendChild(button);
        button.appendChild(link);
        element.appendChild(row);

    }

}

renderTableData(data);

(async () => {

    let { modpackId } = await browser.storage.local.get("modpackId");
    if (modpackId) {
        loadModpackList(modpackId);
    }

})();
