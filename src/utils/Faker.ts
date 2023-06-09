import { faker } from '@faker-js/faker'
import { Product } from '../entities/IProduct'
import { Fruits, Vegetables, Cheese } from './Payload'

function createRandomProduct(): Product {
    const product: Product = {
        title: faker.helpers.enumValue(Fruits),
        description: faker.lorem.sentence(10),
        code: generateRandomString(6),
        price: parseFloat(faker.commerce.price()),
        status: true,
        stock: getRandomNumber(50),
        category: 'Fruits',
        thumbnails: [faker.image.url()]
    }
    return product
}

export const PRODUCT_BOOTSTRAP: Product[] = faker.helpers.multiple(createRandomProduct, {
    count: 40,
})

function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max)
}

function generateRandomString(length: number) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }

    return result
}

