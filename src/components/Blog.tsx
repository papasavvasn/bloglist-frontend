import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { addLike } from '../services/blogs'

export type Blog = {
  title: string;
  author: string;
  url: string;
  likes: number;
  id: string;
  user?: {
    id: string;
    name: string;
    username: string;
  }
}

type BlogProps = {
  blog: Blog
  onDeleteBlog: (id: string) => void
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export const Blog = ({ blog, onDeleteBlog }: BlogProps) => {

  const { title, author, url, likes: initialLikes, id } = blog
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [likes, setLikes] = useState<number>(initialLikes)
  const [username, setUsername] = useState<string>('')

  function onDelete() {
    if (window.confirm('are you sure you want to delete this blog?')) {
      onDeleteBlog(blog.id)
    }
  }

  useEffect(() => {
    const usernameOfLoggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (usernameOfLoggedInUserJSON) {
      let username = JSON.parse(usernameOfLoggedInUserJSON).username
      setUsername(username)
    }
  }, [])

  const onLike = () => addLike({ blogId: id, blog: { ...blog, likes: likes + 1 } })
    .then(() => { setLikes(likes + 1) }, e => {
      console.log('there was an error adding a like', e)
    })

  return (
    <div style={blogStyle}>
      {title} <button onClick={() => { setShowDetails(!showDetails) }}> {showDetails ? 'hide' : 'view'} </button>
      {showDetails && (
        <>
          <div>{url}</div>
          <div>{likes} <button onClick={onLike}>like</button> </div>
          <div>{author}</div>
          {username === blog?.user?.username && <button onClick={onDelete}>Remove</button>}
        </>
      )}
    </div>
  )
}


Blog.propTypes = {
  onDeleteBlog: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  }).isRequired
}