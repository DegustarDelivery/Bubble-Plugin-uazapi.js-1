async function(properties, context) {
    //▶️ Editar Envio Agendados
    
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

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey,
    };

    const url = `${baseUrl}/automate/scheduleMessage/${instancia}`;

    let remoteJids = [];
    if (properties.remoteJids) {
        remoteJids = properties.remoteJids.split('|').map(remoteJid => remoteJid.trim());
    }

    const raw = {
        delete: properties.delete,
        status: properties.status,
        type: properties.type,
        remoteJids: remoteJids,
        when: properties.when,
        delaySecMin: properties.delaySecMin,
        delaySecMax: properties.delaySecMax,
    };

    if(properties._id) raw._id = properties._id.trim();
    if(properties.info) raw.info = properties.info.trim();
    if(properties.flowName) raw.flowName = properties.flowName.trim();

    raw.message = {};
      if(properties.text) {
  raw.message.text = properties.text.trim();

  // Adiciona linkPreview ao objeto message apenas se text estiver presente
    raw.message.linkPreview = properties.linkPreview;
	}
    
    if(properties.urlOrBase64) raw.message.urlOrBase64 = properties.urlOrBase64.trim();
    if(properties.mediatype) raw.message.mediatype = properties.mediatype.trim();
    if(properties.delay != null) raw.message.delay = properties.delay;


    let response, resultObj;
    let error = false;
    let error_log;

    try {
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(raw)
        });
        resultObj = await response.json();
    } catch(e) {
        error = true;
        error_log = e.toString();
    }

    if (!response.ok) {
        error = true;
        return {
            error: error,
            error_log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        };
    }

    return {
        envioagendado: resultObj,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}
