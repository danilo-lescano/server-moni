module.exports = rudeDB = {};
module.exports = tabelas = {};
module.exports = responder = function (requestListener, dados){
    requestListener.writeHead(200, {'Content-Type': 'text/html'});
    requestListener.write(JSON.stringify(dados));
    requestListener.end();
};