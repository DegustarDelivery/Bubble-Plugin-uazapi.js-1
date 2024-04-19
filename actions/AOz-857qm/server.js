async function(properties, context) {

let axios = require('axios');
    //⚡Enviar Digitando... / Gravando...

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

    const url = `${baseUrl}/chat/updatePresence/${encodeURIComponent(instancia)}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const raw = JSON.stringify({
        "number": properties.number,
        "presence": properties.presence
    });

    let response
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            data: raw
        });

         if (response.status < 200 || response.status >= 300) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
        

    } catch (e) {
        error = true;
        error_log = `Error: ${e.message}`;

    // Melhorando a verificação e extração de detalhes do erro
    if (e.response) {
        let detailedError = e.response.data.message || e.response.data;  // Preferindo a mensagem de erro se disponível
        if (typeof detailedError === 'object') {
            detailedError = JSON.stringify(detailedError);
        }
        error_log += " | Detailed: " + detailedError;
    }

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
