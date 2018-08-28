var http = require('http');
var url = require('url');
var fs = require('fs');
require('./myModule');

http.createServer(function (req, res) {
    var pedido = tryParseJSON(decodeURIComponent(url.parse(req.url, true).path).substring(1));
    var resposta = {};
    if(!pedido || !pedido.tipo){ res.end(); return;}
    else if(pedido.tipo === "avaliarMonitor"){
        resposta.ok = false;
        if(!pedido.user || !pedido.user.pontosDominio || !pedido.user.pontosEmpatia ||!pedido.user.pontosPontualidade){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.id === rudeDB.user[i].id){
                rudeDB.user[i].pontosDominio += pedido.user.pontosDominio;
                rudeDB.user[i].pontosEmpatia += pedido.user.pontosEmpatia;
                rudeDB.user[i].pontosPontualidade += pedido.user.pontosPontualidade;
                resposta.ok = true;
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "criarConta"){
        var criar = true;
        resposta.ok = true;
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.email === rudeDB.user[i].email && pedido.user.senha === rudeDB.user[i].senha){
                criar = false;
                resposta.ok = false;
            }            
        }
        if(criar){
            var index = rudeDB.user.length;
            rudeDB.user[index] = {};
            rudeDB.user[index] = pedido.user;
            rudeDB.user[index].id = index;
        }

        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "editarPerfil"){
        resposta.ok = false;
        if(!pedido.user){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.id === rudeDB.user[i].id){
                var id = rudeDB.user[i].id;
                var senha = pedido.senha || rudeDB.user[i].senha;
                rudeDB.user[i] = pedido.user;
                rudeDB.user[i].id = id;
                rudeDB.user[i].senha = senha;
                resposta.ok = true;
                reposta.user = rudeDB.user[i];
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "login"){
        resposta.existe = false;
        if(!pedido.user){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.email === rudeDB.user[i].email && pedido.user.senha === rudeDB.user[i].senha){
                resposta.existe = true;
                resposta.user = rudeDB.user[i];
                responder(res, resposta);
                return;
            }
        }
    }
    else if(pedido.tipo === "pesquisar"){
        resposta = [];
        if(!pedido.disciplina){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.disciplina === rudeDB.user[i].disciplina){
                var index = resposta.length;
                resposta[index] = rudeDB.user[i];
                resposta[index].senha = "";
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "registrarMonitoria"){
        var index = rudeDB.monitoria.length;
        rudeDB.monitoria[index] = {};
        rudeDB.monitoria[index] = pedido.monitoria;
        rudeDB.monitoria[index].id = index;

        resposta.ok = true;
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "verMonitoria"){
        
    }
    else if(pedido.tipo === "enviarEmail"){

    }
    responder(res, resposta);
}).listen(8010);

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


//criarConta
//http://localhost:8010/%7B%22tipo%22%3A%22criarConta%22%2C%22user%22%3A%7B%22email%22%3A%22tha%40tha.tha%22%2C%22senha%22%3A%22tha%22%7D%7D

//login
//http://localhost:8010/%7B%22tipo%22%3A%22login%22%2C%22user%22%3A%7B%22email%22%3A%22tha%40tha.tha%22%2C%22senha%22%3A%22tha%22%7D%7D