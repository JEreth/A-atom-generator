var fs = require('fs');
var glob = require( 'glob' );
var path = require( 'path' );
var os = require("os");
var http = require("http");

var httpActive = false;

// load field generator
var fields = [];
glob.sync( './fields/*.js' ).forEach( function( file ) {
  fields[path.parse(file).name] = require( path.resolve( file ) );
});

// read config file
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

for (atom of config.atoms) {
  for (field of atom.fields) {
      field.generator = new fields[field.generator](...field.parameters);
  }
  publishEntry(atom);
}

// init http server
function handleRequest(request, response){
  var item = config.atoms.find(function(v) {
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
    response.end("Atom not found");
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
function publishEntry(atom) {
  var output = {name: atom.id}
  for (field of atom.fields) {
    output[field.name]=field.generator.value();
  }
  switch(atom.mode) {
    case 'file':
        fs.appendFile("output/"+atom.id+".json", JSON.stringify(output)+os.EOL, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("New CSV value: "+atom.id);
        });
        setTimeout( publishEntry, atom.publish_interval, atom);
        break;
    case 'http':
        httpActive=true;
        break;
    default:  // no specific mode defined, output in console
        console.log(output);
        setTimeout( publishEntry, atom.publish_interval, atom);
  }

}
