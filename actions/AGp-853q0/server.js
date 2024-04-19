async function(properties, context) {
    //▶️ Instancia - Informações
    
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

    const url = `${baseUrl}/instance/connectionState/${instancia}`;

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

    try {
        response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
    } catch (e) {
        error = true;
        error_log = e.toString();
    }

    if (!response.ok) {
        error = true;
        const responseBody = await response.json();
        return {
            error: error,
            error_log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"")
        };
    }

    const resultObj = await response.json();

    return {
        instancia: resultObj,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}
