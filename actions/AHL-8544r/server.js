async function(properties, context) {

let axios = require('axios');
    //▶️ Grupo - Detalhes
    
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
    
    const url = `${baseUrl}/group/findGroupInfos/${instancia}?groupJid=${properties.groupid}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    let response;
    let error = false;
    let error_log;
    ;

    try {
            response = await axios({
            url: url,
            method: 'get',
            headers: headers
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
        error_log = e.toString();
        return {
            error: error,
            error_log: error_log
        };
    }

    

    return {
        grupo: response.data,
        error: String(error),
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: String(error_log)
    };
}

