const nodemailer=require("nodemailer");
const{MAIL_USER,MAIL_PASS}=process.env

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:MAIL_USER,
        pass:MAIL_PASS
    }
});

async function sendMail(to,subject,message){
    try{
        let info=await transporter.sendMail({
            from:MAIL_USER,
            to,
            subject,
            html:message
        });
        console.log("Email sent:",info.messageId);
    }catch(error){
        console.error("error sending mail:",error);
    }
}

module.exports=sendMail;