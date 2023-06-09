import { Model } from 'mongoose'

export default abstract class MongoDao<T> {
    protected model: Model<any>

    constructor(model:Model<any>) {
        this.model = model
    }
    
    async create(data:any): Promise<T> {
        const savedObject = await this.model.create(data)
        return savedObject.toObject()
    }

    async findById(id: any): Promise<T | null> {
        const item = await this.model.findById(id)
        return item ? item.toObject() : null
    }

    async findAll(): Promise<T[]> {
        const objects = await this.model.find({})
        return objects.map((o) => o.toObject())
    }

    async deleteById(id: any): Promise<number> {
        const deleted = await this.model.deleteOne({ _id: id })
        return deleted.deletedCount
    }

    async deleteAll(): Promise<void> {
        await this.model.deleteMany({})
    }
}