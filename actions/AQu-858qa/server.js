async function(properties, context) {

let axios = require('axios');
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
    ;

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
            response = await axios({
            url: url,
            method: 'put',
            headers: headers,
            data: raw,
        });

         if (response.status < 200 || response.status >= 300) {
            error = true;
            
            return {
                error: error,
                error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"")
            };
        }

        
    } catch (e) {
        error = true;
        error_log = `Error: ${e.message}`;

    // Verifica se o objeto de resposta existe no erro e captura os dados de resposta
    if (e.response) {
        // JSON.stringify pode ser removido dependendo de como você quer logar/tratar o erro
        error_log += " | Detailed: " + JSON.stringify(e.response.data);
    }

    return {
        error: error,
        error_log: error_log
    };
}

    return {
        grupo: response.data,
        error: String(error),
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: String(error_log)
    };
}

