async function(properties, context) {
    //🔓Enviar Digitando... / Gravando...

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

    let response, resultObj;
    let error = false;
    let error_log;

    try {
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: raw
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        resultObj = await response.json();
        

    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    return {
        resultado: resultObj ? JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\"") : null,
        error: error,
        error_log: error_log
    };
}
