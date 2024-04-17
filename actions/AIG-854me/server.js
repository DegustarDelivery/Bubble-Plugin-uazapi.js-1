async function(properties, context) {
    //▶️ Enviar audio
    
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

    const url = `${baseUrl}/message/sendWhatsAppAudio/${instancia}`;
        
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
        
let send = properties.audio
// Verifica e corrige o campo "send" se necessário
if (properties.audio && properties.audio.startsWith("//")) {
send = "https:" + properties.audio;
}

    const body = {
        "number": properties.number,
        "audioMessage": {
            "audio": send
        },
        "options": {
            "delay": properties.delay,
            "presence": "recording"
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

            if (response.ok) {
                resultObj = await response.json();
                return {
                    remoteJid: resultObj?.key?.remoteJid,
                    fromMe: resultObj?.key?.fromMe,
                    id: resultObj?.key?.id,
                    status: resultObj?.status ? resultObj?.status.toString() : undefined,
                    error: false,
                    log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
                    error_log: null
                };
            } else {
                error = true;
                const responseBody = await response.json();
                error_log = JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"");
                if (attempt === retries - 1) {
                    return {
                        error: error,
                        error_log: error_log
                    };
                }
            }
        } catch (e) {
            console.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            error = true;
            error_log = e.toString();
            if (!e.message.toLowerCase().includes("fetch failed") || attempt === retries - 1) {
                return {
                    error: error,
                    error_log: error_log
                };
            }
        }

        attempt++;
        console.log("Retrying fetch...");
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }

    return {
        error: error,
        error_log: "Failed after all retries."
    };
}
}
