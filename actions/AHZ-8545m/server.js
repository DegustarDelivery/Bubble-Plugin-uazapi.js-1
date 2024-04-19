async function(properties, context) {
    //▶️ Instancia - Configurar Webhook
    
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

    const url = `${baseUrl}/webhook/set/${instancia}`;
    
    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const body = {
        "enabled": properties.enabled,
        "local_map": properties.local_map,
        "url": properties.webhookurl,
        "STATUS_INSTANCE":properties.STATUS_INSTANCE,
        "QRCODE_UPDATED":properties.QRCODE_UPDATED,
        "MESSAGES_SET":properties.MESSAGES_SET,
        "MESSAGES_UPDATE":properties.MESSAGES_UPDATE,
        "MESSAGES_UPSERT":properties.MESSAGES_UPSERT,
        "SEND_MESSAGE":properties.SEND_MESSAGE,
        "CONTACTS_SET":properties.CONTACTS_SET,
        "CONTACTS_UPSERT":properties.CONTACTS_UPSERT,
        "CONTACTS_UPDATE":properties.CONTACTS_UPDATE,
        "PRESENCE_UPDATE":properties.PRESENCE_UPDATE,
        "CHATS_SET":properties.CHATS_SET,
        "CHATS_UPSERT":properties.CHATS_UPSERT,
        "CHATS_UPDATE":properties.CHATS_UPDATE,
        "CHATS_DELETE":properties.CHATS_DELETE,
        "CONNECTION_UPDATE":properties.CONNECTION_UPDATE,
        "groups_ignore": properties.groups_ignore,
        "GROUPS_UPSERT":properties.GROUPS_UPSERT,
        "GROUPS_UPDATE":properties.GROUPS_UPDATE,
        "GROUP_PARTICIPANTS_UPDATE":properties.GROUP_PARTICIPANTS_UPDATE
    };

    let response, resultObj;
    let error = false;
    let error_log;

    try {
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
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
        webhook_status: resultObj.webhook,
        error: error,
        log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log,
    };
}

