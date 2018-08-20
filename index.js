var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
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