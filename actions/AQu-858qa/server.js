async function(properties, context) {
    //▶️ Grupo - Editar Configurações
    
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
    
    const url = baseUrl + "/group/groupBetterSetting/" + instancia + "?groupJid=" + properties.groupid;
    
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

    let raw = {}

    if(properties.edit_name) {
        raw.name = properties.name;
    }
    if(properties.edit_image) {
        raw.image = properties.image;
    }
    if(properties.edit_description) {
        raw.description = properties.description;
    }
    if(properties.edit_restrict) { 
        raw.restrict = properties.restrict;
    }
    if(properties.edit_announce) { 
        raw.announce = properties.announce;
    }
    if(properties.edit_memberAddMode) { 
        raw.memberAddMode = properties.memberAddMode;
    }
    if(properties.edit_joinApprovalMode) { 
        raw.joinApprovalMode = properties.joinApprovalMode;
    }
    if(properties.edit_expiration) { 
        raw.expiration = properties.expiration;
    }
 
     
  


    try {
        response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(raw),
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
        grupo: resultObj,
        error: String(error),
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: String(error_log)
    };
}

