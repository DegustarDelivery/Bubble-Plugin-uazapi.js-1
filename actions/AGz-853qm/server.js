async function(properties, context) {
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
    
    const url = `${baseUrl}/message/sendReaction/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    const raw = {
        "reactionMessage": {
            "key": {
                "remoteJid": properties.remoteJid,
                "fromMe": properties.fromMe,
                "id": properties.id
            },
            "reaction": properties.reaction
        }
    };

    let response;
    let error = false;
    let error_log;
    let resultObj;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            body: raw
        });

        if (response.status !== 200) {
            error = true;
            const responseBody = response.data;
            return {
                error: error,
                status: response.status.toString(),
                error_log: JSON.stringify(responseBody, null, 2).replace(/"_p_/g, "\"")
            };
        }

        resultObj = response.data;
    } catch (e) {
        error = true;
        error_log = e.toString();
        return {
            error: error,
            error_log: error_log
        };
    }

    return {
        remoteJid: resultObj?.key?.remoteJid,
        fromMe: resultObj?.key?.fromMe,
        id: resultObj?.key?.id,
        status: resultObj?.status,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}
