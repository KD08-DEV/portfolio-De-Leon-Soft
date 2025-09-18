const express= require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT| 3000;
require("dotenv").config({ path: "config.env" });g
//middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

// Ruta para recibir los datos del formulario
app.post("/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // Configuración del transporte (ejemplo con Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,       // tu correo
                pass: process.env.MAIL_PASS, // usa contraseña de aplicación si es Gmail
            },
        });
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER, // destino (puede ser el mismo u otro)
            subject: "Request DeLeon Soft",
            html: `
        <h3>Nuevo mensaje recibido:</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Respuesta al frontend
        res.json({ success: true, message: "Tu mensaje ha sido enviado correctamente ✅" });

    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ success: false, message: "Hubo un error al enviar tu mensaje ❌" });
    }
});
console.log("Usuario:", process.env.MAIL_USER);
console.log("Pass existe:", !!process.env.MAIL_PASS);

//server
app.listen(port,()=>{
    console.log(`App runing at localhost:${port}`);
})