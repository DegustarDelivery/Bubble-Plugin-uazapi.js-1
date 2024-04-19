async function(properties, context) {

let axios = require('axios');
    //▶️ Editar Campos Personalizados
    
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

    const url = `${baseUrl}/automate/updateCustomFields/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const raw = {};
    
    if(properties._id) raw._id = properties._id.trim();
    if(properties.name) raw.name = properties.name.trim();
    if(properties.order != null) raw.order = properties.order;
    if(properties.delete != null) raw.delete = properties.delete;

    let response, response.data;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            body: raw
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
        ticketSystem: response.data,
        error: error,
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
