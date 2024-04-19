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
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    if (!response.ok) {
        error = true;
        const responseBody = await response.json();
        return {
            error: error,
            error_log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"")
        };
    } 

    const resultObj = await response.json();

    return {
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        instancia: resultObj.instance?.instanceName,
        status: resultObj.instance?.status,
        apikey: resultObj.hash?.apikey,
        qrcode: resultObj.qrcode?.base64,
        paircode: resultObj.qrcode?.pairingCode,
        error: error,
        error_log: error_log        
    };
}
