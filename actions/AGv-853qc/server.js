function(properties, context) {
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
        
        var url = baseUrl + "/message/sendMedia/" + instancia;
        
        // campos opcionais
        let caption = properties.caption ? { "caption": properties.caption } : {};
        let fileName = properties.filename ? { "fileName": properties.filename } : {};
    
    let mediaMessage = {
  "mediatype": properties.mediatype,
  "media": properties.media,
  ...caption,
  ...fileName
}
    
        let headers = {
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "apikey": apikey
        };
        
        var raw =  {
                "number": properties.number,
                "mediaMessage": mediaMessage,
                "options": {
                  "delay": properties.delay
              	}
            };
       
        
            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,  
                uri: url,
                json: true
            };
    
    
        let sentRequest;
        let error;
    error = false;
        let error_log;
        try {
            sentRequest = context.request(requestOptions);
        } catch(e) {
            error = true;
            error_log = e.toString();
        }
    
        if (sentRequest.statusCode.toString().charAt(0) !== "2") {
            error = true;
           
            return {
                error: error,
                error_log: JSON.stringify(sentRequest.body, null, 2).replace(/"_p_/g, "\""),
            }
        }  
    
        let resultObj;
        try {
            resultObj = sentRequest.body;
        } catch(e) {
            error = true;
            error_log = `Error getting response body: ${e.toString()}`;
        }
    
      
            return {
                remoteJid: resultObj?.key?.remoteJid,
                fromMe: resultObj?.key?.fromMe,
                id: resultObj?.key?.id,
                status: resultObj?.status ? resultObj?.status.toString() : undefined,
                error: error,
                log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
                error_log: error_log,
            };

    
    }