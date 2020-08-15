import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

export const unpack = ({ data }: { data: any }) => data

export const login = ({ username, password }: { username: string, password: string }) => axios.post(baseUrl, { username, password }).then(unpack)
