async function(properties, context) {

let axios = require('axios');
    //▶️ Editar Lead - Chat

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

    const url = `${baseUrl}/chat/editChat/${instancia}`;

    const headers = {
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "uazapi": "true",
        "apikey": apikey
    };

    const leadInfo = {};


  
    if(properties.desativadoFluxoAte != null ) leadInfo.desativadoFluxoAte = properties.desativadoFluxoAte;
    if(properties.nome) leadInfo.nome = properties.nome.trim();
    if(properties.nomecompleto) leadInfo.nomecompleto = properties.nomecompleto.trim();
    if(properties.email) leadInfo.email = properties.email.trim();
    if(properties.cpf) leadInfo.cpf = properties.cpf.trim();
    if(properties.status) leadInfo.status = properties.status.trim();
    if(properties.notas) leadInfo.notas = properties.notas.trim();
    if(properties.atendimentoAberto != null) leadInfo.atendimentoAberto = properties.atendimentoAberto;
    if(properties.responsavelid) leadInfo.responsavelid = properties.responsavelid.trim();
    if(properties.customFields) {
    try {
        leadInfo.customFields = JSON.parse(properties.customFields);
    } catch (e) {
        leadInfo.customFields = [];
        console.log('Erro ao analisar customFields: ', e);
    }
    }

  const raw = {
    "_id": properties.id
};

if(properties.unreadcount != null ) raw.unreadcount = properties.unreadcount;
if(properties.delete !== "none" ) raw.delete = properties.delete;
if(properties.muteEndTime != null ) raw.muteEndTime = properties.muteEndTime;   
 

    // Adicionando ou removendo 'tags' em 'leadInfo' com base em 'editTags'
    if (properties.editTags) {
        if (properties.tags) {
            let tags = properties.tags.split('|').map(tag => tag.trim());
            leadInfo.tags = tags.filter(tag => tag); // Remove strings vazias
        } else {
            leadInfo.tags = []; // Remove todas as tags se o array for vazio
        }
    }
    
// Adicionando ou removendo 'etiquetas' de 'leadInfo' com base em 'editEtiquetas'
if (properties.editEtiquetas) {
  if (properties.etiquetas) {
      let etiquetas = properties.etiquetas.split('|').map(etiqueta => etiqueta.trim());
      leadInfo.etiquetas = etiquetas.filter(etiqueta => etiqueta); // Remove strings vazias
  } else {
      leadInfo.etiquetas = []; // Remove todas as etiquetas se o array for vazio
  }
}
    
    if(Object.keys(leadInfo).length > 0) raw.leadInfo = leadInfo;
    

    let response, response.data;
    let error = false;
    let error_log;

    try {
            response = await axios({
            url: url,
            method: 'post',
            headers: headers,
            body: raw
        });
        


    if (response.status !== 200) {
        error = true;
        return {
            error: error,
            error_log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
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
        chat: response.data,
        error: error,
        log: JSON.stringify(response.data, null, 2).replace(/"_p_/g, "\""),
        error_log: error_log
    };
}

