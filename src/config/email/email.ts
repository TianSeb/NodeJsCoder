import { createTransport } from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import { logger } from '../../utils/Logger'
import ejs from 'ejs'
import { handleTryCatchError } from '../../utils/Utils'

const rootPath = process.cwd()

dotenv.config({
  path: path.resolve(rootPath, `./.env.${process.env.NODE_ENV}`)
})

const mailConfig: object = {
  host: process.env.EMAIL_HOST,
  port: process.env.PORT_ETHEREAL,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}

const transporter: Transporter = createTransport(mailConfig)

export async function sendOrderEmail(
  userEmail: string,
  totalPrice: string | number,
  products: object[]
): Promise<void> {
  try {
    const templateFile = readFileSync(
      path.join(__dirname, 'email_template.ejs'),
      'utf-8'
    )
    const html = ejs.render(templateFile, { userEmail, totalPrice, products })

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'Purchase Order',
      html
    }
    await transporter.sendMail(mailOptions)
    logger.info(`Mail Sent to: ${userEmail}`)
  } catch (error) {
    handleTryCatchError('Error sending purchase email', error)
  }
}

export async function sendResetPassword(
  userEmail: string,
  hashCode: string
): Promise<void> {
  try {
    const templateFile = readFileSync(
      path.join(__dirname, 'reset_password.ejs'),
      'utf-8'
    )
    const html = ejs.render(templateFile, { userEmail, hashCode })

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'Password Reset',
      html
    }
    await transporter.sendMail(mailOptions)
    logger.info(`Email Sent: ${userEmail}`)
  } catch (error) {
    handleTryCatchError('Error sending reset email', error)
  }
}

export async function sendDeletedEmail(userEmails: string[]): Promise<void> {
  try {
    const templateFile = readFileSync(
      path.join(__dirname, 'email_deleted.ejs'),
      'utf-8'
    )

    await Promise.all(
      userEmails.map(async (userEmail) => {
        const html = ejs.render(templateFile, { userEmail })

        const mailOptions = {
          from: process.env.EMAIL,
          to: userEmail,
          subject: 'Email Deleted',
          html
        }

        await transporter.sendMail(mailOptions)
        logger.info(`Email Deleted: ${userEmail}`)
      })
    )
  } catch (error) {
    handleTryCatchError('Error sending delete email', error)
  }
}
