async function(properties, context) {
    //▶️ Instancia - Buscar todas
    
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

    const url = `${baseUrl}/instance/fetchInstances`;

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
    let resultObj;

    try {
        response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            error = true;
            const responseBody = await response.json();
            return {
                error: error,
                error_log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"")
            };
        }

        resultObj = await response.json();

    } catch (e) {
        error = true;
        error_log = e.toString();
        return {
            error: error,
            error_log: error_log
        };
    }

    return {
        instancias: resultObj,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
