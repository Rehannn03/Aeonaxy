import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'jedidiah.dare28@ethereal.email',
      pass: 'R2TmMrdBaGEd9mZ7vf'
  }
});

const emailVerification=(email,id)=>{
  const mailOptions={
    from:'angela.beahan66@ethereal.email',
    to:email,
    subject:"Email verification",
    html:`<h1>Click on the link to verify your email</h1><button><a href=http://localhost:3000/api/v1/users/verifyEmail/${id}>Verify</a></button> `
  }
  transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(info)
    }
  })
}

export default emailVerification