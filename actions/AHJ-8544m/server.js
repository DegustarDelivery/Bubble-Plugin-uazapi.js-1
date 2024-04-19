async function(properties, context) {
    //▶️ Grupo - Criar
    
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

    const url = `${baseUrl}/group/create/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const number = properties.participants && properties.participants.split('|').map(number => number.trim());

    const body = {
        "subject": properties.subject,
        "description": properties.description,
        "participants": number
    };

    let response;
    let error = false;
    let error_log;
    let resultObj;

    try {
                response = await axios({
            url: url,
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.status !== 200) {
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
        grupo: resultObj,
        error: String(error),
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: String(error_log)
    };
}

