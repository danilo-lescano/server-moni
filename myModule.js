module.exports = rudeDB = {};
module.exports = responder = function (requestListener, dados){
    requestListener.writeHead(200, {'Content-Type': 'text/html'});
    requestListener.write(dados);
    requestListener.end();
};