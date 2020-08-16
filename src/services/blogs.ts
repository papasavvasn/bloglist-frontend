import axios from 'axios'
import { unpack } from './login'
const baseUrl = 'http://localhost:3003/api/blogs'

type Blog = {
  title: string;
  author: string;
  url: string;
  likes: number;
}

let token: string | undefined = undefined;

export const setToken = (tokenArg: string) => token = `bearer ${tokenArg}`

export const getAll = () => axios.get(baseUrl).then(unpack)

export const addBlog = (blog: Blog) => axios.post(baseUrl, blog, { headers: { Authorization: token as string } }).then(unpack)

export const addLike = ({ blogId, blog }: { blogId: string, blog: Blog }) => axios.put(`${baseUrl}/${blogId}`, blog, { headers: { Authorization: token as string } }).then(unpack)

export const deleteBlog = (blogId: string) => axios.delete(`${baseUrl}/${blogId}`, { headers: { Authorization: token as string } }).then(unpack)

