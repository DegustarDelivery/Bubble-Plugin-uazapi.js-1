async function(properties, context) {
    //▶️ Buscar etiquetas
    
    let baseUrl = properties.url;
    if (!baseUrl || baseUrl.trim() === "" || !baseUrl.includes("http")) {
        baseUrl = context.keys["Server URL"];
    }

    baseUrl = baseUrl ? baseUrl.trim() : '';
    baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    let apikey = properties.apikey;
    apikey = apikey ? apikey.trim() : context.keys["Global APIKEY"];

    let instancia = properties.instancia;
    instancia = instancia ? instancia.trim() : context.keys["Instancia"];

    const url = `${baseUrl}/chat/findLabels/${encodeURIComponent(instancia)}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };


    let response, resultObj;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'get',
            headers: headers,
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        resultObj = response.data;
        

    } catch(e) {
        error = true;
        error_log = e.toString();
    }

		return {
        etiquetas: resultObj,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
