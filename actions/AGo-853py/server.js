async function(properties, context) {
    //▶️ Instancia - Criar
    
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

    const url = `${baseUrl}/instance/create`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    const body = {
        "instanceName": properties.instanceName,
        "apikey": properties.apikeysenha,
        
    };
    
    if (properties.number) {
    body.number = properties.number
    }
    
    let response;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            body: body
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
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        instancia: response.data.instance?.instanceName,
        status: response.data.instance?.status,
        apikey: response.data.hash?.apikey,
        qrcode: response.data.qrcode?.base64,
        paircode: response.data.qrcode?.pairingCode,
        error: error,
        error_log: error_log        
    };
}
