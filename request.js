async function request({ method, url, headers = {}, data = null, onProgress = () => {} }) {

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        for (const [ key, value ] of Object.entries(headers)) {

            if (key.toLowerCase() === "content-type" && typeof value === "string") {
                if (value.toLowerCase().includes("application/json")) {
                    if (typeof data === "object") data = JSON.stringify(data);
                }
            }

            xhr.setRequestHeader(key, value);

        }

        xhr.onreadystatechange = function() {

            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 100) {

                const headers = {};
                xhr.getAllResponseHeaders().split("\r\n").filter(x => x != "").forEach((pair) => {
                    const [ key, value ] = pair.split(": ");
                    headers[key] = value;
                });

                resolve({
                    status: xhr.status,
                    headers: headers,
                    body: xhr.responseText
                });
                
            }

        };

        xhr.upload.onprogress = onProgress;

        xhr.onerror = function() {
            reject(new Error("XMLHttpRequest failed!"));
        };

        xhr.send(data);

    });

}
