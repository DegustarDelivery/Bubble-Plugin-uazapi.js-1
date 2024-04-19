async function(properties, context) {

let axios = require('axios');
    //⚡Arquivar Conversa

    let baseUrl = properties.url;
    if (!baseUrl || baseUrl.trim() === "" || !baseUrl.includes("http")) {
        baseUrl = context.keys["Server URL"];
    }

    baseUrl = baseUrl ? baseUrl.trim() : '';
    baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    let apikey = properties.apikey;
    apikey = apikey ? apikey.trim() : context.keys["Global APIKEY"];

    let instancia = properties.instancia;
    instancia = instancia ? instancia.trim() : context.keys["Instancia"];

    const url = `${baseUrl}/chat/archiveChat/${encodeURIComponent(instancia)}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const raw = JSON.stringify({
        "lastMessage": {
            "key": {
                "remoteJid": properties.remoteJid,
                "fromMe": properties.fromMe,
                "id": properties.id
            }
        },
        "archive": properties.archive
    });

    let response, response.data;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'put',
            headers: headers,
            data: raw
        });
        
         if (response.status < 200 || response.status >= 300) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
    } catch (e) {
        error = true;
        error_log = e.toString();
        return {
            error: error,
            error_log: error_log
        };
    }

    return {
        resultado: response.data ? JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"") : null,
        error: error,
        error_log: error_log
    };
}
