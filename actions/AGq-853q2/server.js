async function(properties, context) {
    // ▶️ Instancia - QR Code
    
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

    const url = `${baseUrl}/instance/connect/${instancia}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };

    let response;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'get',
            headers: headers
        });


    if (response.status !== 200) {
        error = true;
        
        return {
            error: error,
            error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\"")
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
        qrcode: response.data.base64,
        error: error,
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}
