var http = require('http');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
require('./myModule');

http.createServer(function (req, res) {
    var pedido = tryParseJSON(decodeURIComponent(url.parse(req.url, true).path).substring(1));
    var resposta = {};
    if(pedido === false || !pedido.tipo){ res.end(); return;}
    else if(pedido.tipo === "avaliarMonitor"){
        
    }
    else if(pedido.tipo === "criarConta"){
        console.log(rudeDB.userNaoAutenticado.length);
        var index = rudeDB.userNaoAutenticado.length;
        rudeDB.user[index] = rudeDB.userNaoAutenticado[index] = {};
        rudeDB.user[index] = pedido.user;
        rudeDB.userNaoAutenticado[index].user = pedido.user;
        rudeDB.userNaoAutenticado[index].chave =  pedido.chave;
        resposta.ok = true;
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "editarPerfil"){
        
    }
    else if(pedido.tipo === "enviarEmail"){
        
    }
    else if(pedido.tipo === "login"){
        console.log("login");
        console.log(rudeDB.user);
        console.log(pedido);
        for(var i = 0; i < rudeDB.user.length; i++){
        console.log(pedido.email + " " + rudeDB.user[i].email + " " + pedido.senha + " " + rudeDB.user[i].senha);
            if(pedido.user.email === rudeDB.user[i].email && pedido.user.senha === rudeDB.user[i].senha){
                resposta.existe = true;
                resposta.user = rudeDB.user[i];
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
        tabelas = JSON.parse(data);

        for (let index = 0; index < tabelas.length; index++) {
            let element = tabelas[index];
            fs.appendFile("tabelas/._"+element, '', function (err){
                if (err) throw err;
                fs.readFile("tabelas/._"+element, '', function (err, data) {
                    if (err) throw err;
                    let tabela = tryParseJSON(data);
                    if(tabela)
                        rudeDB[element] = tabela;
                    else{
                        rudeDB[element] = [];
                        fs.writeFile("tabelas/._"+element, '[]', function (err, data) {
                            if (err) throw err;
                        });
                    }
                });
            });
        }
    });
});
function start(){
    var tempo = 60000;
    setInterval(function(){
        for (let index = 0; index < tabelas.length; index++) {
            let element = tabelas[index];
            fs.writeFile("tabelas/._"+element, JSON.stringify(rudeDB[element]), function (err){
                if (err) throw err;
            });
        }
    },tempo);
}start();