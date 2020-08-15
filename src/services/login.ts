import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

export const login = async ({ username, password }: { username: string, password: string }) => {
    const response = await axios.post(baseUrl, { username, password })
    return response.data
}