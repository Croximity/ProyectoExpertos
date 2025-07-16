const correo = require('nodemailer');

exports.EnviarCorreo = async (datos) =>{
    const transporte = correo.createTransport({
        host: process.env.correoservicio,
        port: 465,
        secure: true,
        auth:{
            user: process.env.correousuario,
            pass: process.env.correocontra,
        }
    });
    const opciones = {
        from: process.env.correousuario,
        to: datos.para,
        subject: datos.asunto,
        text: datos.descripcion,
        html: datos.html
    };
    return transporte.sendMail(opciones, (Error, info)=>{
        if(Error){
            console.log(Error);
            return false;
        }
        else{
            console.log(info);
            return true;
        }
    })

} 