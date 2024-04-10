import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }:any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType==="VERIFY"){
            await User.findByIDAndUpdate(userId,{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        }else if(emailType==="RESET"){
            await User.findByIDAndUpdate(userId,{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }


        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "d7f403c5c02c1d", //in .env
                pass: "2473420cf4734f" //in .env
            }
        });
        const mailOptions = {
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: email, // list of receivers
            subject: (emailType === "VERIFY") ? "Verify your Email" : "Reset your password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailResp = await transport.sendMail(mailOptions);

        return mailResp;
    } catch (error:any) {
        throw new Error(error.message);
    }
}