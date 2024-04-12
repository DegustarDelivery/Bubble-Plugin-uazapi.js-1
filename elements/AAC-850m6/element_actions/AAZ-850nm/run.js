function(instance, properties, context) {
    
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


    let instancia = properties.instancia;
    if (!instancia || instancia.trim() === "") {
        instancia = context.keys["Instancia"];
    }

    var url = baseUrl + "/automate/createflow/" + instancia;
    
    
    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("uazapi", "true");
    myHeaders.append("apikey", properties.apikey);
    

var raw = {};

try {
  // Se properties.import existir e for uma string JSON válida, 
  // parse e adicione ao objeto raw.
  if (properties.import && properties.import.trim() !== "") {
    var importObject = JSON.parse(properties.import);
    raw = { ...importObject };
  }

  // Se properties.name existir, atualize o campo 'name' em raw.
  if (properties.name && properties.name.trim() !== "") {
    raw.name = properties.name;
  }
    
  // Adiciona 'global' a raw, convertendo para string.
  if (properties.global !== undefined) {
  	raw.global = String(properties.global);
  }

} catch (e) {
  console.error("O valor de 'import' não é um JSON válido:", e);
  
}



    

    // Converta o objeto raw em uma string JSON
    var rawString = JSON.stringify(raw);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: rawString,
       
    };
    
  
    
 

    //console.log("rawString: ", rawString);
    

instance.publishState('resultado', '');
instance.publishState('error', false);
instance.publishState('error_log', '');


fetch(url, requestOptions)
.then(response => {
    // Sempre obter o corpo da resposta, independentemente do status da resposta
    return response.json().then(resultObj => {
        // Se a resposta não for ok, adicione o status ao objeto de erro e lance-o
        if (!response.ok) {
            resultObj.errorStatus = response.status;
            throw resultObj;
        }
        return resultObj; // Retorna o objeto de resultado para a próxima etapa
    });
   })
    .then(resultObj => {
       
               
        if (Object.keys(resultObj).length > 0) {
            instance.publishState('resultado', JSON.stringify(resultObj, null, 2).replace(/"_p_/g, "\""));
          instance.triggerEvent('sucessEvent');
      
            
            instance.publishState('bot', resultObj);
            
        }
    })
    .catch(errorObj => {
        instance.publishState('error', true);
        try {
            // Verifica se as chaves têm o prefixo _p_ e acessa os valores adequadamente
            let errorStatus = errorObj._p_errorStatus || errorObj.errorStatus || '';
            let error = errorObj._p_error || errorObj.error || '';
            let message = '';
  
            if (errorObj._p_message || errorObj.message) {
                let messageArray = errorObj._p_message || errorObj.message;
                message = Array.isArray(messageArray) ? messageArray.join('\n') : messageArray;
            }
  
            let errorMessage = [errorStatus, error, message].filter(Boolean).join('\n');
            instance.publishState('error_log', errorMessage);
        } catch(e) {
            instance.publishState('error_log', e.toString().replace(/"_p_/g, "\""));
        }
        instance.triggerEvent('errorEvent');
    });


}