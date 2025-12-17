export interface Role {
  id: string
  name: 'Admin' | 'User'
}

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: Role
}
