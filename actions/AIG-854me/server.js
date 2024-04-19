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
    
    let response, resultObj;
    let error = false;
    let error_log;

    try {
                response = await axios({
            url: url,
            method: 'POST',
            headers: headers,
            body: body
        });
        resultObj = await response.json();
    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    if (response.status !== 200) {
        error = true;
        return {
            error: error,
            error_log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        };
    } 

    return {
        remoteJid: resultObj?.key?.remoteJid,
        fromMe: resultObj?.key?.fromMe,
        id: resultObj?.key?.id,
        status: resultObj?.status ? resultObj?.status.toString() : undefined,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}

