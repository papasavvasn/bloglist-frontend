import React, { FormEvent, useRef } from 'react'
import { SubmitBlog } from '../services/blogs'

type NewBlogFormProps = {
    setDisplayCreateNewNoteForm: React.Dispatch<React.SetStateAction<boolean>>
    displayNotification: ({ message, type }: { message: string; type: 'success' | 'error' }) => void
    getBlogs: () => Promise<void>
    addBlog: (blog: SubmitBlog) => Promise<any>
}

export const NewBlogForm = ({ addBlog, setDisplayCreateNewNoteForm, displayNotification, getBlogs }: NewBlogFormProps) => {

    const titleRef = useRef<HTMLInputElement | null>(null)
    const authorRef = useRef<HTMLInputElement | null>(null)
    const urlRef = useRef<HTMLInputElement | null>(null)

    async function onCreateNew(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const title = titleRef.current!.value
        const author = authorRef.current!.value
        const url = urlRef.current!.value
        try {
            await addBlog({ title, author, url, likes: 0 })
            displayNotification({ message: 'A new blog was added!!', type: 'success' })
            getBlogs()
            titleRef.current!.value = ''
            authorRef.current!.value = ''
            urlRef.current!.value = ''
            setDisplayCreateNewNoteForm(false)
        } catch (e) {
            displayNotification({ message: 'The creation of the new blog failed, please try again', type: 'error' })
        }
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={onCreateNew}>
                <div>
                    <label htmlFor="title"><b>Title</b></label>
                    <input type="text" placeholder="Enter Title" name="title" id='title' required ref={titleRef} />
                </div>
                <div>
                    <label htmlFor="author"><b>Author</b></label>
                    <input type="text" placeholder="Enter Author" name="author" id='author' required ref={authorRef} />
                </div>
                <div>
                    <label htmlFor="url"><b>Url</b></label>
                    <input type="text" placeholder="Url" name="url" id='url' required ref={urlRef} />
                </div>
                <button type="submit">Create Post</button>
            </form>
            <button onClick={() => { setDisplayCreateNewNoteForm(false) }} >cancel</button>
        </>
    )
}