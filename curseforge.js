const { parentElement: downloadButton } = document.querySelector("a[data-tooltip='Download file']");

const buttonWrapper = document.createElement("div");
buttonWrapper.classList.add("px-1");

const button = document.createElement("button");
button.classList.add("se-uvidi-button");
button.textContent = "Add to Aperiment";
button.addEventListener("click", async function() {

    this.disabled = true;
    const matches = window.location.href.match(/^(.*\/mc-mods\/.*)(\/.*)|.*$/);
    const url = matches[1] || matches[0];

    let { modpackId } = await browser.storage.local.get("modpackId");

    const response = await request({
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
notice.innerHTML = "Powered by <a href='https://www.skulaurun.eu/se-uvidi/' target='_blank'>Se-Uvidi</a> API.";

buttonWrapper.appendChild(button);
buttonWrapper.appendChild(notice);

downloadButton.parentElement.insertBefore(buttonWrapper, downloadButton);
