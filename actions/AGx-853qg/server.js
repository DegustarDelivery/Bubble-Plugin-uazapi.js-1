async function(properties, context) {
    //▶️ Enviar enquete
    
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

    const url = `${baseUrl}/message/sendMenu/${instancia}`;
    
    // Separando as opções fornecidas pelo usuário em um array
    const choices = properties.choices.split('|').map(opcao => opcao.trim());

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "apikey": apikey
    };
    
    const raw =     {
      "number": properties.number,
      "menuMessage": {
        "type": properties.type,
        "text": properties.text,
        //enquete:
        "selectableCount": properties.selectableCount,
        //listas
        "footerText": properties.footerText,
        "buttonText": properties.buttonText,
        "choices": choices
      	},
        "options": {
        	"delay": properties.delay
    	}
        
    	
    };

    let retries = 3;
    let attempt = 0;
    let response, resultObj;

    while (attempt < retries) {
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(raw)
            });

            resultObj = await response.json(); // Assume we always get JSON back
            let isError = response.status >= 400;

            return {
                remoteJid: resultObj.key?.remoteJid,
                fromMe: resultObj.key?.fromMe,
                id: resultObj.key?.id,
                status: resultObj.status?.toString(),
                error: isError,
                log: JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""),
                error_log: isError ? JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\"") : null
            };
            
        } catch (e) {
            console.log(`Error on attempt ${attempt + 1}: ${e.message}`);
            if (attempt < retries - 1 && e.message.includes("fetch failed")) {
                console.log("Retrying fetch...");
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }
            return {
                error: true,
                error_log: `Error: ${e.message}`
            };
        }
    }

    return {
        error: true,
        error_log: "Failed after all retries."
    };
}}
