async function(properties, context) {
    //▶️ Buscar Envio Agendados
    
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

    const url = `${baseUrl}/automate/scheduleMessage/${instancia}`;

    const myHeaders = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey,
    };

    console.log(myHeaders);
    console.log(url);

    let response, resultObj;
    let error = false;
    let error_log;

    try {
        response = await fetch(url, {
            method: 'GET',
            headers: myHeaders,
        });
        resultObj = await response.json();
    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    if (!response.ok) {
        error = true;
        return {
            error: error,
            error_log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        };
    }

    return {
        envioagendado: resultObj,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
