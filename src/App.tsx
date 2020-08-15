import React, { useState, useEffect, useRef, FormEvent } from 'react'
import Blog from './components/Blog'
import { getAll, setToken, addPost } from './services/blogs'
import { login } from './services/login'

type Blog = {
  id: string
}

type User = {
  token: string;
  name: string;
  username: string;
}

const App = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [user, setUser] = useState<User | null>(null)

  const usernameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const authorRef = useRef<HTMLInputElement | null>(null)
  const urlRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const getBlogs = async () => {
    const blogs = await getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    getBlogs()
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const username = usernameRef.current!.value
    const password = passwordRef.current!.value
    try {
      const user = await login({ username, password })
      setUser(user)
      setToken(user.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      usernameRef.current!.value = ""
      passwordRef.current!.value = ""
    } catch (e) {
      console.log("there was an error", e);
    }
  }

  async function onCreateNew(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const title = titleRef.current!.value
    const author = authorRef.current!.value
    const url = urlRef.current!.value
    try {
      await addPost({ title, author, url })
      getBlogs()
      titleRef.current!.value = ""
      authorRef.current!.value = ""
      urlRef.current!.value = ""
    } catch (e) {
      console.log("Error", e);
    }

  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" required ref={usernameRef} />
          </div>
          <div>
            <label htmlFor="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" required ref={passwordRef} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {`${user.name} is logged in`} <br />
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <button onClick={() => {
        window.localStorage.removeItem("loggedInUser")
        setUser(null)
      }
      }>Log out</button>
      <h2>create new</h2>
      <form onSubmit={onCreateNew}>
        <div>
          <label htmlFor="title"><b>Title</b></label>
          <input type="text" placeholder="Enter Title" name="title" required ref={titleRef} />
        </div>
        <div>
          <label htmlFor="author"><b>Author</b></label>
          <input type="text" placeholder="Enter Author" name="author" required ref={authorRef} />
        </div>
        <div>
          <label htmlFor="url"><b>Url</b></label>
          <input type="text" placeholder="Url" name="url" required ref={urlRef} />
        </div>
        <button type="submit">Create Post</button>
      </form>

    </div>
  )
}

export default App