import swaggerJSDoc from 'swagger-jsdoc'

const info = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Tecnologías utilizadas: Node, Express, MongoDB'
    },
    servers: [{ url: 'https://eccomerce-salasia.onrender.com' }]
  },
  apis: [
    './src/docs/User/*.yml',
    './src/docs/Product/*.yml',
    './src/docs/Cart/*.yml',
    './src/docs/*.yml'
  ]
}

export const swaggerSpec = swaggerJSDoc(info)
