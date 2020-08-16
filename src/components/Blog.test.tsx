import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Blog } from './Blog'

const mockBlog = {
    'title': 'This is the final blog',
    'author': 'Ernest Hemingway',
    'url': 'http://some-url',
    'likes': 0,
    'user': {
        'username': 'Cool_username',
        'name': 'Name',
        'id': '5f2fe16a5fc46394e6b54655'
    },
    'id': '5f38d7b5ccccc49887a5ff4a'
}

const onDeleteBlog = jest.fn()
const onLike = jest.fn()

describe('Blog', () => {
    describe('by default', () => {
        it('should render the title of the blog and an author', () => {
            const component = render(<Blog blog={mockBlog} onDeleteBlog={onDeleteBlog} onLike={onLike} />)
            const title = component.getByText(mockBlog.title)
            const author = component.getByText(mockBlog.author)
            expect(title).toBeDefined()
            expect(author).toBeDefined()
        })
        it('should not render the url or the likes', () => {
            const component = render(<Blog blog={mockBlog} onDeleteBlog={onDeleteBlog} onLike={onLike} />)
            const url = component.queryByText(mockBlog.url)
            const likes = component.queryByText((mockBlog.likes).toString())
            expect(url).toBeNull()
            expect(likes).toBeNull()
        })
    })
    describe('when the `view` button is clicked', () => {
        it('should render the url and the likes', () => {
            const component = render(<Blog blog={mockBlog} onDeleteBlog={onDeleteBlog} onLike={onLike} />)
            const button = component.getByText('view')
            fireEvent.click(button)
            const url = component.queryByText(mockBlog.url)
            const likes = component.queryByText((mockBlog.likes).toString())
            expect(url).not.toBeNull()
            expect(likes).not.toBeNull()
        })
        it('pressing twice the like button calls the addLike function two times', () => {
            const component = render(<Blog blog={mockBlog} onDeleteBlog={onDeleteBlog} onLike={onLike} />)
            const button = component.getByText('view')
            fireEvent.click(button)
            const likeButton = component.getByText('like')
            fireEvent.click(likeButton)
            fireEvent.click(likeButton)
            expect(onLike.mock.calls).toHaveLength(2)
        })
    })
})
