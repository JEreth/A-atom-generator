var fs = require('fs');
var glob = require( 'glob' );
var path = require( 'path' );
var os = require("os");
var http = require("http");
var mqtt = require('mqtt');

var httpActive = false;
var mqttBroker = false;

// load field generator
var fields = [];
glob.sync( './fields/*.js' ).forEach( function( file ) {
  fields[path.parse(file).name] = require( path.resolve( file ) );
});

// read config file
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// settings
if('settings' in config){
  if('mqtt' in config.settings && 'broker' in config.settings.mqtt) {
    console.log("connect "+config.settings.mqtt.broker);
      mqttBroker = mqtt.connect(config.settings.mqtt.broker);
  }
}

// parse sources
for (source of config.sources) {
  for (field of source.fields) {
      field.generator = new fields[field.generator](...field.parameters);
  }
  publishEntry(source);
}

// init http server
function handleRequest(request, response){
  var item = config.sources.find(function(v) {
    return (v.id==request.url.substring(1) && v.mode == 'http');
  })

  if (typeof item!= "undefined") {
      var output = {name: item.id}
      for (field of item.fields) {
        output[field.name]=field.generator.value();
      }
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(200);
      response.end(JSON.stringify(output));
      console.log("Http call: "+JSON.stringify(output));
  } else {
    response.writeHead(404);
    response.end("Source not found");
  }

}

// Create a server
if (httpActive) {
  var httpServer = http.createServer(handleRequest);
  httpServer.listen(8000, function(){
      console.log("Server listening on: http://localhost:%s", 8000);
  });
}


// publish entry depending on mode
function publishEntry(source) {
  var output = {name: source.id}
  for (field of source.fields) {
    output[field.name]=field.generator.value();
  }
  switch(source.mode) {
    case 'file':
        fs.appendFile("output/"+source.id+".json", JSON.stringify(output)+os.EOL, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("New CSV value: "+source.id+" "+JSON.stringify(output));
        });
        setTimeout( publishEntry, source.publish_interval, source);
        break;
    case 'http':
        httpActive=true;
        break;
    case 'mqtt':
        try {
          mqttBroker.publish(source.id, JSON.stringify(output));
        } catch(er) {
          console.log("Mqtt broker not ready or not configured");
        }
        console.log("New MQTT value: "+source.id+" "+JSON.stringify(output));
        setTimeout( publishEntry, source.publish_interval, source);
        break;
    default:  // no specific mode defined, output in console
        console.log(output);
        setTimeout( publishEntry, source.publish_interval, source);
  }
}
