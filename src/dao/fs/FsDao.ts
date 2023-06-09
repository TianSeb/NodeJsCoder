import createError from 'http-errors'
import path from 'path'

const rootPath = process.cwd()
const dbFolderPath = path.resolve(rootPath, 'database')

export default abstract class FsDao<T> {
    protected fileName: string
    fs = require('fs')

    constructor(fileName:string) {
        this.fileName = path.resolve(dbFolderPath, fileName)

        if (!this.fs.existsSync(dbFolderPath)) {
            this.fs.mkdirSync(dbFolderPath)
        }

        if (!this.fs.existsSync(this.fileName)) {
            this.fs.writeFileSync(this.fileName, '[]')
        }
    }

    protected async objectCodeExists(object: any) {
        let objects = await this.getDatabase()

        if (objects.length > 0) {
            let objIndex = objects.findIndex((obj: any) => obj.code === object.code)
            return objIndex
        }
        return -1
    }

    protected async save(data: Array<any>) {
        await this.fs.promises.writeFile(this.fileName, JSON.stringify(data, null, '\t'))
    }

    protected async getDatabase() {
        try {
            let database = await this.fs.promises.readFile(this.fileName, 'utf-8')
            let objects = []
            if (database === "") {
                database = await this.fs.promises.writeFile(this.fileName, '[]')
            } else {
                objects = JSON.parse(database)
            }
            return objects
        } catch (error) {
            throw new createError.GatewayTimeout("error while connecting to db")
        }
    }
}