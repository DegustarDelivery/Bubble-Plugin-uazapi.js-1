async function(properties, context) {

let axios = require('axios');
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

    const data = {
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
        data.options.mentions = { "everyOne": true };
    }

    if (properties.quoted && properties.quoted.trim() !== "") {
        data.options.quoted = { key: { id: properties.quoted.trim() } };
    }

    let response;
    let error = false;
    let error_log;

    try {
    response = await axios({
            method: 'post',
            url: url,
            headers: headers,
            data: data
        });

         if (response.status < 200 || response.status >= 300) {
            error = true;
            
            return {
                error: error,
                error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"")
            };
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



    // Verificar se response.data não é nulo antes de acessar suas propriedades
    return {
        remoteJid: response.data && response.data.key ? response.data.key.remoteJid : undefined,
        fromMe: response.data && response.data.key ? response.data.key.fromMe : undefined,
        id: response.data && response.data.key ? response.data.key.id : undefined,
        status: response.data && response.data.status ? response.data.status.toString() : undefined,
        error: error,
        log: response.data ? JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"") : undefined,
        error_log: error_log
    };
}
