import React, { useState, useEffect, useRef, FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Blog, IBlog } from './components/Blog'
import { addBlog, getAll, addLike, setToken, deleteBlog, SubmitBlog } from './services/blogs'
import { login } from './services/login'
import { Notification } from './components/Notifications'
import { NewBlogForm } from './components/NewBlogForm'
import { setNotification, Type } from './reducers/notificationReducer'
import { RootState } from "./store"


type User = {
  token: string;
  name: string;
  username: string;
}

const App = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [displayCreateNewNoteForm, setDisplayCreateNewNoteForm] = useState<boolean>(false)
  const notificationText: string = useSelector((state: RootState) => state.notification.notificationText)
  const notificationType: Type = useSelector((state: RootState) => state.notification.type)
  const isVisible = useSelector((state: RootState) => state.notification.isVisible)
  const dispatch = useDispatch()

  const usernameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)


  const displayNotification = ({ message, type }: { message: string, type: 'success' | 'error' }) => {
    dispatch(setNotification({ notificationText: message, type, time: 5 }))
  }

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

  const onDeleteBlog = (id: string) => {
    deleteBlog(id).then(
      () => { getAll().then(blogs => setBlogs(blogs)) },
      e => { console.log('error', e) })
  }

  const addBlogCb = (blog: SubmitBlog) => addBlog(blog)

  const onLike = (blog: IBlog) => {
    addLike({ blogId: blog.id, blog: { ...blog, likes: blog.likes + 1 } })
      .then(() => {
        const likedBlog = { ...blog, likes: blog.likes + 1 }
        const indexOfLikedBlog = blogs.findIndex(el => el.id === blog.id)
        setBlogs([...blogs.slice(0, indexOfLikedBlog), likedBlog, ...blogs.slice(indexOfLikedBlog + 1)])
      }, e => {
        console.log('there was an error adding a like', e)
      })
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
      usernameRef.current = null
      passwordRef.current = null
    } catch (e) {
      displayNotification({ message: e.response?.data?.error, type: 'error' })
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notificationText} type={notificationType} />
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
      {isVisible && <Notification message={notificationText} type={notificationType} />}
      <h2>blogs</h2>
      {`${user.name} is logged in `}
      <button onClick={() => {
        window.localStorage.removeItem('loggedInUser')
        setUser(null)
      }
      }>Log out</button>
      <br />
      {!displayCreateNewNoteForm
        ?
        <button onClick={() => { setDisplayCreateNewNoteForm(true) }} >new note</button>
        : <NewBlogForm
          addBlog={addBlogCb}
          getBlogs={getBlogs}
          setDisplayCreateNewNoteForm={setDisplayCreateNewNoteForm}
          displayNotification={displayNotification}
        />}

      <br />
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog as IBlog} onDeleteBlog={onDeleteBlog} onLike={onLike} />
      )}

    </div>
  )
}

export default App