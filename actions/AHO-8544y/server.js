async function(properties, context) {
    //▶️ Grupo - Mudar Url de Convite

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

    const url = `${baseUrl}/group/revokeInviteCode/${instancia}?groupJid=${properties.groupid}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    let response, resultObj;
    let error = false;
    let error_log;

    try {
                response = await axios({
            url: url,
            method: 'PUT',
            headers: headers
        });
        resultObj = await response.json();
    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    if (response.status !== 200) {
        error = true;
       
        return {
            error: error,
            error_log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        };
    } 

    return {
        url: resultObj.inviteUrl,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}
