function inject() {
    
    for (const element of document.querySelectorAll("#menuButton")) {

        const { parentElement: downloadButton } = element;

        if (downloadButton.parentElement.classList.contains("file-details")) {
            continue;
        }

        const url = element.querySelector("#contextMenu a[href]")
            ?.href.replace(/\/(install|download)\/[0-9]*$/, "");
        
        if (!url.includes("/mc-mods/")) {
            continue;
        }

        const button = document.createElement("button");
        button.classList.add("se-uvidi-button");
        button.classList.add("curseforge-button");
        button.textContent = "Aperiment";
        button.addEventListener("click", async function() {
        
            this.disabled = true;
            let { modpackId } = await browser.storage.local.get("modpackId");
            
            await request({
                method: "POST",
                url: `https://www.skulaurun.eu/aperiment/api/v1/modpacks/${modpackId}/add`,
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    url: url
                }
            });

        });
        
        const notice = document.createElement("p");
        notice.classList.add("se-uvidi-notice");
        notice.innerHTML = "Powered by <a href='https://www.skulaurun.eu/se-uvidi/' target='_blank'>Se&#8209;Uvidi</a> API.";

        const buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("se-uvidi-button-wrapper");

        if (element.parentElement.classList.contains("project-card")) {
            buttonWrapper.classList.add("split-button", "curseforge-search");
        }
        
        buttonWrapper.appendChild(button);
        buttonWrapper.appendChild(notice);
        
        downloadButton.insertBefore(buttonWrapper, element);

    }

}

inject();

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type == "attributes" && mutation.attributeName == "class") {
            if (mutation.target.getAttribute("class") != "nprogress-busy") {
                if (!window.location.href.includes("/mc-mods/")) {
                    inject();
                }
            }
        }
    });
});

observer.observe(document.documentElement, { attributes: true });
