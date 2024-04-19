async function(properties, context) {
    //▶️ Editar Config Geral XX
    
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

    const url = `${baseUrl}/config`;
    
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
            headers: headers,
            //body: JSON.stringify(body)
        });
    } catch(e) {
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
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error: error,
        error_log: error_log,
        config: resultObj,
    };
}
