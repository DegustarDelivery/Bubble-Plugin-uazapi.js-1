async function(properties, context) {
    //▶️ Buscar Mensagens

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

    const url = `${baseUrl}/chat/findMessages/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    let limite = properties.limit ? { "limit": properties.limit } : {};

    const raw = {
        "where": {
            "key": {
                "remoteJid": properties.remoteJid
            }
        },
        ...limite
    };

    let response;
    let error = false;
    let error_log;
    ;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            body: raw
        });

        if (response.status !== 200) {
            error = true;
            
            return {
                error: error,
                error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"")
            };
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
        mensagens: response.data,
        error: String(error),
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: String(error_log)
    };
}

