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
};
module.exports = checker = function (data){ //checkar as variaveis que recebe do cliente
    for (var i = 0; i < data.length; i = i + 2) {
        if( typeof data[i] !== undefined &&
            (typeof data[i] === typeof data[i+1] || typeof data[i] === typeof (isNaN(data[i+1]) ? " ": 1) ) )
            continue;
        console.log("Erro param: " + i);
        return true; //algo deu errado
    }
    return false; //tudo certo
};
module.exports = gerarChave = function (crypto){
    var key = '';
    for(var i = 0; i < 5; i++)
        key+=Math.floor(Math.random()*16777215).toString(16);
    return key;
};
module.exports = sendMail = function (nodemailer, mailContent){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'moni.ifms@gmail.com',
            pass: 'nq3i4fsx@123'
        }
    });
    mailContent.from = 'MONI APP <moni.ifms@gmail.com>';

    transporter.sendMail(mailContent, function(error, info){
        if (error) {
            console.log('ERROR EMAIL');
        } else {
            console.log('Email enviado');
        }
    });
};



/*
var nodemailer = require('nodemailer');
// Create the transporter with the required configuration for Gmail
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'moni.ifms@zoho.com',
        pass: 'nq3i4fsx@123'
    }
});
// setup e-mail data, even with unicode symbols
var mailOptions = {
    from: '"Our Code World " <moni.ifms@zoho.com>', // sender address (who sends)
    to: 'nq3i4fsx@hotmail.com,thaislescano@hotmail.com', // list of receivers (who receives)
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
*/