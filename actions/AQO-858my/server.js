async function(properties, context) {
    //▶️ Importar Chats
    
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

    const url = `${baseUrl}/chat/importChats/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    let body = properties.chats
    

    let response;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'put',
            headers: headers,
            body: body.replace(/\n/g, '')

        });

        if (response.status !== 200) {
            error = true;
            const responseBody = response.data;
            return {
                error: error,
                error_log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"")
            };
        }

    } catch (e) {
        error = true;
        error_log = e.toString();
    }

    const resultObj = response.data;

    return {
 
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
