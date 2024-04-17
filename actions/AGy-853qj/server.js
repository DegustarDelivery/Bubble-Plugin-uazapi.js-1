async function(properties, context) {
    //▶️ Enviar contato
    
    let baseUrl = properties.url;
    if (!baseUrl || baseUrl.trim() === "" || !baseUrl.includes("http")) {
        baseUrl = context.keys["Server URL"];
    }

    if (baseUrl) {
        baseUrl = baseUrl.trim();
    }
    
    if (baseUrl && baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
    }

    let apikey = properties.apikey;
    if (!apikey || apikey.trim() === "") {
        apikey = context.keys["Global APIKEY"];
    }
    
    if (apikey) {
        apikey = apikey.trim();
    }

    let instancia = properties.instancia;
    if (!instancia || instancia.trim() === "") {
        instancia = context.keys["Instancia"];
    }

    const url = `${baseUrl}/message/sendContact/${instancia}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    const raw = {
        "number": properties.number,
        "contactMessage": [
            {
                "fullName": properties.fullName,
                "wuid": properties.wuid,
                "phoneNumber": properties.wuid
            }
        ],
        "options": {
            "delay": properties.delay
        }
    };

    let retries = 3;
    let attempt = 0;
    let response, resultObj;

    while (attempt < retries) {
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(raw)
            });

            if (response.ok) {
                resultObj = await response.json();
                return {
                    remoteJid: resultObj.key?.remoteJid,
                    fromMe: resultObj.key?.fromMe,
                    id: resultObj.key?.id,
                    status: resultObj.status?.toString(),
                    error: false,
                    log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\"")
                };
            } else {
                const errorResponse = await response.json();
                let errorLog = JSON.stringify(errorResponse, null, 2).replace(/"_p_/g, "\"");
                if (response.status >= 400) {
                    return { // Return immediately if it's a client or server error
                        error: true,
                        error_log: errorLog
                    };
                }
                throw new Error(`HTTP status ${response.status}: ${errorLog}`);
            }
        } catch (e) {
            console.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            if (e.message.includes("fetch failed") && attempt < retries - 1) {
                console.log("Retrying fetch...");
                attempt++;
            } else {
                return { // Return the last caught error if it's not a fetch fail or retries are exhausted
                    error: true,
                    error_log: `Error: ${e.message}`
                };
            }
        }
    }

    return { // Default return if all retries fail
        error: true,
        error_log: "Failed after all retries."
    };
}

