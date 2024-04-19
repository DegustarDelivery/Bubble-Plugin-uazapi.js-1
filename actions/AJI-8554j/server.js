async function(properties, context) {
    //▶️ Grupo - Modificar membros
    
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

    const url = `${baseUrl}/group/updateParticipant/${instancia}?groupJid=${properties.groupid}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    // Separating the user-provided options into an array
    const participants = properties.participants.split('|').map(number => number.trim());
    
    const body = {
        "action": properties.action,
        "participants": participants
    };

    let response, response.data;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'put',
            headers: headers,
            body: body
        });
        


    if (response.status !== 200) {
        error = true;
        return {
            error: error,
            error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
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
        error: error,
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}

