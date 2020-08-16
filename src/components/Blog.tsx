import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export interface IBlog {
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
  blog: IBlog
  onDeleteBlog: (id: string) => void
  onLike: (blog: IBlog) => void
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export const Blog = ({ blog, onDeleteBlog, onLike }: BlogProps) => {

  const { title, author, url, likes } = blog
  const [showDetails, setShowDetails] = useState<boolean>(false)
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

  return (
    <div style={blogStyle}>
      {title} <button onClick={() => { setShowDetails(!showDetails) }}> {showDetails ? 'hide' : 'view'} </button>
      <div>{author}</div>
      {showDetails && (
        <>
          <div>{url}</div>
          <div>{likes} <button onClick={() => onLike(blog)}>like</button> </div>
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