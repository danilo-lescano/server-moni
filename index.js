var http = require('http');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
require('./myModule');

http.createServer(function (req, res) {
    var pedido = tryParseJSON(decodeURIComponent(url.parse(req.url, true)).substring(1));
    var resposta;
    if(pedido === false || !pedido.tipo) requisicaoInvalida();
    else if(pedido.tipo === "avaliarMonitor"){
        
    }
    else if(pedido.tipo === "criarConta"){
        var index = rudeDB.userNaoAutenticado.length;
        rudeDB.userNaoAutenticado[index] = pedido.user;
        rudeDB.userNaoAutenticado[index].user.chave =  x;
        for(var i = 0; i < rudeDB.userNaoAutenticado.length; i++){
            if(pedido.email === rudeDB.user.email && pedido.senha === rudeDB.user.senha){
                responder(res, resposta);
                return;
            }
        }
    }
    else if(pedido.tipo === "editarPerfil"){
        
    }
    else if(pedido.tipo === "enviarEmail"){
        
    }
    else if(pedido.tipo === "login"){
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.email === rudeDB.user.email && pedido.senha === rudeDB.user.senha){
                responder(res, resposta);
                return;
            }
        }
    }
    else if(pedido.tipo === "pesquisar"){
        
    }
    else if(pedido.tipo === "registrarMonitoria"){
        
    }
    else if(pedido.tipo === "verMonitoria"){
        
    }

    responder(res, resposta);
}).listen(8010);

function tryParseJSON (jsonString){
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
fs.appendFile('rudeDB', '', function (err) {//JSON.stringify(["login", "criarConta", "pesquisar", "avaliarMonitor", "registrarMonitoria", "verMonitoria", "enviarEmail", "editarPerfil"])
    if (err) throw err;
    fs.readFile('rudeDB', '', function (err, data) {
        var tabelas = JSON.parse(data);
        for (let index = 0; index < tabelas.length; index++) {
            let element = tabelas[index];
            fs.appendFile("tabelas/._"+element, '', function (err){
                if (err) throw err;
                fs.readFile(element, '', function (err, data) {
                    rudeDB[element] = tryParseJSON(data);
                });
            });
        }
    });
});