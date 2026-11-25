import { createContext, useContext } from 'react'
import type { Role } from './lib'

export type Account = { id: string; email: string; name: string; role: Role }

export const UserContext = createContext<Account | null>(null)
export const useUser = () => useContext(UserContext)
