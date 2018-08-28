module.exports = rudeDB = {};
module.exports = tabelas = {};
module.exports = responder = function (requestListener, dados){
    if(dados.senha) dados.senha = "";
    requestListener.writeHead(200, {'Content-Type': 'text/html'});
    requestListener.write(JSON.stringify(dados));
    requestListener.end();
};
module.exports = tryParseJSON = function (jsonString){
    try {
        var o = JSON.parse(jsonString);
        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
}