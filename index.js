var http = require('http');
var url = require('url');
var fs = require('fs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

require('./myModule');

http.createServer(function (req, res) {
    var pedido = tryParseJSON(decodeURIComponent(url.parse(req.url, true).path).substring(1));
    var resposta = {};
    console.log("\n---------");

    if(!pedido || !pedido.tipo){ res.end(); return;}
    else if(pedido.tipo === "avaliarMonitor"){ //procura o monitor com o pedido.user.id e soma os pontos
        resposta.ok = false;

        if(checker([
            pedido.user, {},
            pedido.user.id, 1,
            pedido.user.pontosDominio, 1,
            pedido.user.pontosEmpatia, 1,
            pedido.user.pontosPontualidade, 1]))
        {
            console.log("problema\n"+pedido);
            responder(res, resposta);
            return;            
        }

        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.id == rudeDB.user[i].id){
                rudeDB.user[i].pontosDominio += parseInt(pedido.user.pontosDominio);
                rudeDB.user[i].pontosEmpatia += parseInt(pedido.user.pontosEmpatia);
                rudeDB.user[i].pontosPontualidade += parseInt(pedido.user.pontosPontualidade);
                resposta.ok = true;
            }
        }
    }
    else if(pedido.tipo === "criarConta"){//procura para ver se ja n existe uma conta igual e cria se n existir
        var criar = true;
        resposta.ok = true;

        if(checker([//validar algumas variaveis recebidas
            pedido.user, {},
            pedido.user.imagemId, 1,
            pedido.user.nomeCompleto,
            pedido.user.email, " ",
            pedido.user.senha, " ",
            pedido.user.curso, " ",
            pedido.user.semestre, 1,
            pedido.user.monitor, true,]))
        {
            resposta.ok = false;
            console.log("problema\n"+pedido);
            responder(res, resposta);
            return;            
        }

        for(var i = 0; i < rudeDB.user.length; i++){//verificar se já existem alguem com o msm email
            if(pedido.user.email === rudeDB.user[i].email){
                criar = false;
                resposta.ok = false;
                break;
            }
        }
        if(criar){
            var index = rudeDB.user.length;
            rudeDB.user[index] = {};
            rudeDB.user[index] = pedido.user;
            rudeDB.user[index].id = index;
            // vai enviar email de confirmação?
            /*****-SE-SIM-***** apagar o codigo de cima e deixar esse
            var index = rudeDB.user.length;
            rudeDB.userNaoAutenticado[index] = {};
            rudeDB.userNaoAutenticado[index].user = pedido.user;
            rudeDB.userNaoAutenticado[index].chave = gerarChave(crypto);
            var conteudo = {
                to: pedido.user.email,
                subject: 'MONI: confimarção de email!',
                text: 'montar url com a chave aqui' //pode ser html no lugar de text dai só colocar um '<h1>hello world</h1> da vida
            };
            sendMail(nodemailer, conteudo);
            */
        }
    }
    else if(pedido.tipo === "editarPerfil"){//edita o perfil das informações alteradas
        resposta.ok = false;
        if(checker([//validar algumas variaveis recebidas
            pedido.user, {},
            pedido.user.nomeCompleto,
            pedido.user.email, " ",
            pedido.user.senha, " ",
            pedido.user.curso, " ",
            pedido.user.semestre, 1,
            pedido.user.monitor, true,]))
        {
            resposta.ok = false;
            console.log("problema\n"+pedido);
            responder(res, resposta);
            return;            
        }
        if(!pedido.user){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.id === rudeDB.user[i].id){
                rudeDB.user[i].senha = pedido.senha || rudeDB.user[i].senha;
                rudeDB.user[i].imagemId = pedido.imagemId || rudeDB.user[i].imagemId;
                rudeDB.user[i].nomeCompleto = pedido.nomeCompleto || rudeDB.user[i].nomeCompleto;
                rudeDB.user[i].email = pedido.email || rudeDB.user[i].email;
                rudeDB.user[i].curso = pedido.curso || rudeDB.user[i].curso;
                rudeDB.user[i].semestre = pedido.semestre || rudeDB.user[i].semestre;
                rudeDB.user[i].monitor = pedido.monitor || rudeDB.user[i].monitor;
                rudeDB.user[i].disciplina = pedido.disciplina || rudeDB.user[i].disciplina;
                rudeDB.user[i].diaSemana = pedido.diaSemana || rudeDB.user[i].diaSemana;
                rudeDB.user[i].horario = pedido.horario || rudeDB.user[i].horario;

                resposta.ok = true;
                reposta.user = rudeDB.user[i];
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "login"){//verifica se senha e login existem
        console.log(pedido);
        resposta.existe = false;
        if(!pedido.user){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.user.email === rudeDB.user[i].email && pedido.user.senha === rudeDB.user[i].senha){
                resposta.existe = true;
                resposta.user = rudeDB.user[i];
                resposta.user.senha = "";
                responder(res, resposta);
                return;
            }
        }
    }
    else if(pedido.tipo === "pesquisar"){//devolve array com os monitores da disciplina X
        console.log(pedido);
        resposta = [];
        if(!pedido.disciplina && pedido.semestre){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.user.length; i++){
            if(pedido.disciplina === rudeDB.user[i].disciplina && rudeDB.user[i].monitor && rudeDB.user[i].semestre > pedido.semestre){
                var index = resposta.length;
                resposta[index] = rudeDB.user[i];
                resposta[index].senha = "";
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "registrarMonitoria"){
        console.log(pedido);
        var index = rudeDB.monitoria.length;
        rudeDB.monitoria[index] = {};
        rudeDB.monitoria[index] = pedido.monitoria;
        rudeDB.monitoria[index].id = index;

        resposta.ok = true;
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "verMonitoria"){
        console.log(pedido);
        resposta = [];
        if(!pedido.id){
            responder(res, resposta);
            return;
        }
        for(var i = 0; i < rudeDB.monitoria.length; i++){
            if(pedido.id === rudeDB.monitoria[i].monitorid){
                var index = resposta.length;
                resposta[index] = rudeDB.monitoria[i];
            }
        }
        responder(res, resposta);
        return;
    }
    else if(pedido.tipo === "enviarEmail"){

    }
    console.log(pedido);
    console.log(resposta);
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




