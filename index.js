var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    var pedido = decodeURIComponent(url.parse(req.url, true)).substring(1);
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
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
};