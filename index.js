var http = require('http');
var url = require('url');
var fs = require('fs');
var rudeDB;

http.createServer(function (req, res) {
    var pedido = tryParseJSON(decodeURIComponent(url.parse(req.url, true)).substring(1));
    if(pedido === false || !pedido.tipo) requisicaoInvalida();
    else if(pedido.tipo === "login"){
        for (let i = 0; i < rudeDB.length; i++) {
            const element = array[i];
            
        }
    }
}).listen(8010);


/* to do
SERVIDOR: autenticacao do login
SERVIDOR: devolver card monitores da disciplina
SERVIDOR: clickcard devolver perfil monitor
SERVIDOR: clickcard devolver avaliacao de monitoria (só pode avaliar uma vez por mês e se tiver feito monitoria)
SERVIDOR: avaliar monitor
SERVIDOR: registrar alunos que foram na monitoria
SERVIDOR: ver registro de monitoria
APP: botao voltar
*/

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
fs.appendFile('rudeDB', '', function (err) {
    if (err) throw err;
    else{
        fs.readFile('rudeDB', '', function (err, data) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                
            }
        });
    }
});