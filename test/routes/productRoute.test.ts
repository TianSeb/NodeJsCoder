import ProductService from '../../src/services/ProductService'
import ProductController from "../../src/controllers/ProductController"
import createError from 'http-errors'
import { CustomProductRequest } from '../../src/middlewares/validators/ProductMw'
import { pipelineParams } from '../../src/middlewares/validators/ProductMw'

/** SET UP **/
const productService = ProductService.getInstance()
const productController = new ProductController()
let req: Partial<CustomProductRequest>
let res: any
let next: jest.Mock<any, any>
const mockBuildProductQueryPipeline = jest.spyOn(productService, 'buildProductQueryPipeline')
const mockGetProducts = jest.spyOn(productService, 'getProducts')
const expectedPipeline = [
    {
        $match: {
            category: 'Fruits',
        },
    },
    {
        $match: {
            status: true,
        },
    },
    {
        $sort: {
            price: 1,
        },
    },
]
const expectedOptions = {
    page: 1,
    limit: 10,
}
const mockProducts = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
]

beforeEach(() => {
    req = {
        query: {
            page: '1',
            limit: '10',
            category: 'Fruits',
            status: 'true',
            sort: '1',
        },
    }
    res = {
        statusCode: 200,
        body: null,
        json: jest.fn().mockImplementation((data) => {
            res.body = data
        }),
    }
    next = jest.fn()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('pipelineParams middleware', () => {
    it('should set pipeline and options on request object and call next', async () => {
        mockBuildProductQueryPipeline.mockReturnValueOnce(expectedPipeline)
        await pipelineParams(req as CustomProductRequest, res, next)

        expect(req.pipeline).toEqual(expectedPipeline)
        expect(req.options).toEqual(expectedOptions)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })

    it('should call next with error if an exception occurs', async () => {
        const errorMessage = 'Test error'
        mockBuildProductQueryPipeline.mockImplementationOnce(() => {
            throw new Error(errorMessage)
        })
        await pipelineParams(req as CustomProductRequest, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(createError(501, `Something went wrong when building the pipeline params: Error: ${errorMessage}`))
    })
})

describe('Get Products Route', () => {
    it('should return products response with proper links', async () => {
        mockBuildProductQueryPipeline.mockReturnValueOnce(expectedPipeline)
        mockGetProducts.mockResolvedValueOnce({
            docs: mockProducts,
            page: 1,
            totalPages: 3,
            hasNextPage: true,
            hasPrevPage: false,
            nextPage: 2,
            prevPage: null,
        })
        await pipelineParams(req as CustomProductRequest, res, next)
        await productController.getProducts(req as CustomProductRequest, res)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: 200,
            data: mockProducts,
            info: {
                page: 1,
                totalPages: 3,
                nextPage: 'http://localhost:8001/products?page=2',
                prevPage: null,
                hasNextPage: true,
                hasPrevPage: false,
            },
        })
        expect(mockBuildProductQueryPipeline).toHaveBeenCalledWith('Fruits', "true", '1')
        expect(mockGetProducts).toHaveBeenCalledWith(expectedPipeline, expectedOptions)
    })
})
