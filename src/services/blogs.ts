import axios from 'axios'
import { unpack } from './login'
const baseUrl = 'http://localhost:3003/api/blogs'

type Post = {
  title: string;
  author: string;
  url: string;
}

let token: string | undefined = undefined;

export const setToken = (tokenArg: string) => token = `bearer ${tokenArg}`

export const getAll = () => axios.get(baseUrl).then(unpack)

export const addBlog = (post: Post) => axios.post(baseUrl, post, { headers: { Authorization: token as string } }).then(unpack)