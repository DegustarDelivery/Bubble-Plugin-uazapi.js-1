function(instance, properties, context) {
    
  let baseUrl = properties.url;
  if (!baseUrl || baseUrl.trim() === "" || !baseUrl.includes("http")) {
      baseUrl = context.keys["Server URL"];
  }

  var url = baseUrl + "/group/groupSetting/" + properties.instancia + "?groupJid=" + properties.groupid;
  
  
  
  var myHeaders = new Headers();
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("apikey", properties.apikey);
  

  var raw = JSON.stringify(
    {
      "setting": properties.setting
  }
  );

  

  var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
     
  };
  


instance.publishState('resultado', '');
instance.publishState('error', false);
instance.publishState('error_log', '');

fetch(url, requestOptions)
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(resultObj => {

  
  if (Object.keys(resultObj).length > 0) {
 
    instance.publishState('resultado', JSON.stringify(resultObj, null, 2));
    
  }
})
.catch(error => {
  instance.publishState('error', true);
instance.publishState('error_log', error.toString());


});



}