import dotenv from 'dotenv';
import transporter from './transporterMail';
dotenv.config();

async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
const resetLink = `${process.env.RESET_LINK}?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Recuperação de Senha',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="text-align: center; color: #4A90E2;">Recuperação de Senha</h2>
            <p style="font-size: 16px;">Olá,</p>
            <p style="font-size: 16px;">Você solicitou a redefinição de sua senha.</p>
            <p style="font-size: 16px;">Clique no botão abaixo para redefinir sua senha:</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" 
                   style="background-color: #4A90E2; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                   Redefinir Senha
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                Se você não solicitou essa alteração, ignore este e-mail.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} Inovatec-JP. Todos os direitos reservados.
            </p>
        </div>
    `,
    };
    try{
        await transporter.sendMail(mailOptions)
    }catch (error: any) {
        console.error('Error sending email:', error);
        return false
    }
    return true
}
export { 
    sendPasswordResetEmail
}