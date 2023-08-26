import { createTransport } from "nodemailer"
import { readFileSync } from "fs"
import path from "path"
import dotenv from 'dotenv'
import path from 'path'
import { logger } from "../../utils/Logger"

const rootPath = process.cwd()
const ejs = require('ejs')

dotenv.config({
  path: path.resolve(rootPath, `./.env.${process.env.NODE_ENV}`)
})

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.PORT_ETHEREAL,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

export async function sendOrderEmail(userEmail, totalPrice, products) {
  try {
    const templateFile = readFileSync(path.join(__dirname, 'email_template.ejs'), 'utf-8')
    const html = ejs.render(templateFile, { userEmail, totalPrice, products })

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'Purchase Order',
      html: html,
    }
    await transporter.sendMail(mailOptions)
    logger.info('Email Sent:', userEmail)
  } catch (error) {
    logger.error('Error sending email:', error)
  }
}

export async function sendResetPassword(userEmail, hashCode) {
  try {
    const templateFile = readFileSync(path.join(__dirname, 'reset_password.ejs'), 'utf-8')
    const html = ejs.render(templateFile, { userEmail, hashCode })

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'Password Reset',
      html: html,
    }
    //await transporter.sendMail(mailOptions)
    logger.info(`Email Sent: ${userEmail}`)
  } catch (error) {
    logger.error(`Error sending email: ${error.msg}`)
  }
}
