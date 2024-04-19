async function(properties, context) {
    //▶️ Iniciar fluxo
    
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

    const url = `${baseUrl}/automate/startFlow/${instancia}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    const body = {
        "name": properties.name,
        "remoteJid": properties.remoteJid,
    };

    // Se properties.changeVariables existe e não é uma string vazia
    if (properties.changeVariables && properties.changeVariables.trim() !== "") {
        try {
            const parsedChangeVariables = JSON.parse(properties.changeVariables.trim());
            body["changeVariables"] = parsedChangeVariables;
        } catch (e) {
            console.error("Falha ao analisar changeVariables:", e);
            // Não vai adicionar changeVariables ao body em caso de erro
        }
    }

    let response, resultObj;
    let error = false;
    let error_log;

    try {
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
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
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}

