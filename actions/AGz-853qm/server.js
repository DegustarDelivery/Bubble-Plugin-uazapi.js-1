async function(properties, context) {
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
    
    const url = `${baseUrl}/message/sendReaction/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    const raw = {
        "reactionMessage": {
            "key": {
                "remoteJid": properties.remoteJid,
                "fromMe": properties.fromMe,
                "id": properties.id
            },
            "reaction": properties.reaction
        }
    };

       let retries = 3;
    let attempt = 0;
    let response, resultObj, error = false, error_log;

    while (attempt < retries) {
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(raw)
            });

            let responseBody;
            try {
                responseBody = await response.json();
            } catch (e) {
                responseBody = null;
                error_log = "Failed to parse JSON response";
            }

            if (response.ok && responseBody) {
                return {
                    remoteJid: responseBody.key?.remoteJid,
                    fromMe: responseBody.key?.fromMe,
                    id: responseBody.key?.id,
                    status: responseBody.status ? responseBody.status.toString() : undefined,
                    error: false,
                    log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\""),
                    error_log: null
                };
            } else if (!response.ok && responseBody) {
                error_log = JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"");
                return {
                    error: true,
                    error_log: error_log
                };
            } else {
                throw new Error(`HTTP status ${response.status}: ${error_log}`);
            }
        } catch (e) {
            console.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            error_log = `Error: ${e.message}`;
            if (attempt >= retries - 1 || !e.message.toLowerCase().includes("fetch failed")) {
                return {
                    error: true,
                    error_log: error_log
                };
            }
        }

        attempt++;
        console.log("Retrying fetch...");
        //await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }

    return {
        error: true,
        error_log: "Failed after all retries."
    };
}
}
