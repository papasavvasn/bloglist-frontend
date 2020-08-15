import React, { useState, useEffect, useRef, FormEvent } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
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

  useEffect(() => {
    blogService.getAll().then(blogs => {

      console.log("blogs are", blogs)
      setBlogs(blogs)

    }
    )
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const username = usernameRef.current!.value
    const password = passwordRef.current!.value
    try {
      const user = await login({ username, password })
      setUser(user)
      usernameRef.current = null
      passwordRef.current = null
    } catch (e) {
      console.log("there was an error", e);
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
    </div>
  )
}

export default App