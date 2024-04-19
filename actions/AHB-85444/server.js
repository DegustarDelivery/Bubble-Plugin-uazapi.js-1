async function(properties, context) {

let axios = require('axios');
    //▶️ Mensagem - Apagar para todos

    
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

    const url = `${baseUrl}/chat/deleteMessageForEveryone/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    let participant = properties.participant ? { "participant": properties.participant } : {};
    
    const raw = {
        "id": properties.id,
        "remoteJid": properties.remoteJid,
        "fromMe": properties.fromMe,
        ...participant
    };

    let response;
    let error = false;
    let error_log;
    ;

    try {
            response = await axios({
            url: url,
            method: 'delete',
            headers: headers,
            data: raw
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

    // Verifica se o objeto de resposta existe no erro e captura os dados de resposta
    if (e.response) {
        // JSON.stringify pode ser removido dependendo de como você quer logar/tratar o erro
        error_log += " | Detailed: " + JSON.stringify(e.response.data);
    }

    return {
        error: error,
        error_log: error_log
    };
}

    

    return {
        type: response.data.message.protocolMessage.type,
        error: error,
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
