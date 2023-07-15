function(instance, properties, context) {
    //🔓 Grupo - Detalhes
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

  var url = baseUrl + "/group/findGroupInfos/" + instancia + "?groupJid=" + properties.groupid;
  
  
  
  var myHeaders = new Headers();
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/json");
    myHeaders.append("uazapi", "true");
  myHeaders.append("apikey", properties.apikey);
  

  

  var requestOptions = {
      method: 'GET',
      headers: myHeaders,

  };
    


instance.publishState('resultado', '');
instance.publishState('error', false);
instance.publishState('error_log', '');

fetch(url, requestOptions)
.then(response => response.json())
.then(resultObj => {

instance.publishState('resultado', JSON.stringify(resultObj, null, 2));
instance.publishState('grupo', resultObj);

})
.catch(error => {
instance.publishState('error', true);
instance.publishState('error_log', error.toString());
});




}