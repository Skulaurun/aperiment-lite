for (const element of document.querySelectorAll("#menuButton")) {

    const { parentElement: downloadButton } = element;

    const button = document.createElement("button");
    button.classList.add("se-uvidi-button");
    button.classList.add("curseforge-button");
    button.textContent = "Aperiment";
    button.addEventListener("click", async function() {
    
        this.disabled = true;
        const url = element.querySelector("#contextMenu a[href]")
            ?.href.replace(/\/(install|download)\/[0-9]*$/, "");
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
    
    buttonWrapper.appendChild(button);
    buttonWrapper.appendChild(notice);
    
    downloadButton.insertBefore(buttonWrapper, element);

    if (["files"].some(x => window.location.href.endsWith(x)) || document.querySelector("span[title='You must be logged in to report a Project.']") != null) {
        break;
    }

}
