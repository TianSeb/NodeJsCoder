export interface User {
    _id?: string
    firstName: string
    lastName: string
    email: string
    password: string
    age: Number
    role?: string
    isGithub?: boolean
    isGoogle?: boolean
}

export interface UserGithub extends Omit<Partial<User>, 'age' | 'password'> {
    password?: string
    age?: Number
    isGithub?: boolean
}

export interface UserGoogle extends Omit<Partial<User>, 'age' | 'password'> {
    password?: string
    age?: Number
    isGoogle?: boolean
}
