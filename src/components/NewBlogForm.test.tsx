import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { NewBlogForm } from './NewBlogForm'

const setDisplayCreateNewNoteForm = jest.fn()
const displayNotification = jest.fn()
const getBlogs = jest.fn()
const addBlog = jest.fn()

const testInputs = {
    title: 'this is a test title',
    author: 'this is a test Author',
    url: 'this is a test url',
    likes: 0
}

describe('NewBlogForm', () => {
    describe('when the submit button is clicked', () => {
        it('should call `addBlog` with the correct arguments', () => {
            const component = render(<NewBlogForm
                addBlog={addBlog}
                setDisplayCreateNewNoteForm={setDisplayCreateNewNoteForm}
                getBlogs={getBlogs}
                displayNotification={displayNotification}
            />)
            const titleInput = component.getByLabelText('Title')
            const authorInput = component.getByLabelText('Author')
            const urlInput = component.getByLabelText('Url')
            fireEvent.change(titleInput, {
                target: { value: testInputs.title }
            })
            fireEvent.change(authorInput, {
                target: { value: testInputs.author }
            })
            fireEvent.change(urlInput, {
                target: { value: testInputs.url }
            })
            const button = component.getByText('Create Post')
            fireEvent.click(button)
            expect(addBlog).toHaveBeenCalledWith(testInputs)
        })
    })
})
