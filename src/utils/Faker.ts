import { faker } from '@faker-js/faker'
import { Product } from '../entities/IProduct'
import { Fruits, Vegetables, Cheese } from './Payload'

export function generateRandomProducts(enumType: string, count: number): Product[] {
    return faker.helpers.multiple(() => createRandomProduct(enumType), {
        count: count,
    })
}

function getRandomEnumValue(enumType: string): string {
    let enumValues: string[]

    switch (enumType) {
        case 'Fruits':
            enumValues = Object.values(Fruits)
            break;
        case 'Vegetables':
            enumValues = Object.values(Vegetables)
            break;
        case 'Cheese':
            enumValues = Object.values(Cheese)
            break;
        default:
            throw new Error('Invalid enum type')
    }

    return faker.helpers.arrayElement(enumValues)
}

function createRandomProduct(enumType: string): Product {
    const product: Product = {
        title: getRandomEnumValue(enumType),
        description: faker.lorem.sentence(10),
        code: generateRandomString(6),
        price: parseFloat(faker.commerce.price()),
        status: true,
        stock: getRandomNumber(50),
        category: enumType,
        thumbnails: [faker.image.url()],
    }
    return product
}

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

