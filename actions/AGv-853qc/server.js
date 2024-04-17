async function(properties, context) {
    //▶️ Enviar arquivo

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

    const url = `${baseUrl}/message/sendMedia/${instancia}`;
    
    let send = properties.media
    // Verifica e corrige o campo "send" se necessário
    if (properties.media && properties.media.startsWith("//")) {
    send = "https:" + properties.media;
    }

    // campos opcionais
    const caption = properties.caption ? { "caption": properties.caption } : {};
    const fileName = properties.filename ? { "fileName": properties.filename } : {};

    const mediaMessage = {
        "mediatype": properties.mediatype,
        "media": send,
        ...caption,
        ...fileName
    };

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    const raw = {
        "number": properties.number,
        "mediaMessage": mediaMessage,
        "options": {
            "delay": properties.delay
        }
    };

    if (properties.mentions === true) {
        raw.options.mentions = { "everyOne": true };
    }

    if (properties.quoted && properties.quoted.trim() !== "") {
        raw.options.quoted = { key: { id: properties.quoted.trim() } };
    }

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

            resultObj = await response.json(); // Assume we always get JSON back
            let isError = response.status >= 400;

            return {
                remoteJid: resultObj.key?.remoteJid,
                fromMe: resultObj.key?.fromMe,
                id: resultObj.key?.id,
                status: resultObj.status?.toString(),
                error: isError,
                log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
                error_log: isError ? JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\"") : null
            };
            
        } catch (e) {
            console.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            if (attempt < retries - 1 && e.message.includes("fetch failed")) {
                console.log("Retrying fetch...");
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }
            return {
                error: true,
                error_log: `Error: ${e.message}`
            };
        }
    }

    return {
        error: true,
        error_log: "Failed after all retries."
    };
}}
