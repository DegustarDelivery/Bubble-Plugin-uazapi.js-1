async function(properties, context) {
    //▶️ Enviar texto

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

    const url = `${baseUrl}/message/sendText/${instancia}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    const raw = {
        "number": properties.number,
        "textMessage": {
            "text": properties.text
        },
        "options": {
            "delay": properties.delay,
            "linkPreview": properties.linkPreview,
            "changeVariables": properties.changeVariables,
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
                // Se a resposta não for ok e o status for >= 400
                return {
                    error: true,
                    error_log: errorLog
                };
            }
        } catch (e) {
            //c-nsole.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            if (attempt < retries - 1 && e.message.includes("fetch failed")) {
                //c-nsole.log("Retrying fetch...");
                attempt++;
                continue; // Continua no loop de retentativas
            }
            return { // Retorna erro se não for um problema de "fetch failed" ou se as retentativas se esgotarem
                error: true,
                error_log: `Error: ${e.message}`
            };
        }
    }

    return { // Retorno padrão se todas as retentativas falharem
        error: true,
        error_log: "Failed after all retries."
    };
}