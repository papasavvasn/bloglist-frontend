const testUser = {
    name: 'testName',
    username: 'testUsername',
    password: 'testPassword',
}

describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users', testUser)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('Log in to application')
        cy.contains('Username')
        cy.contains('Password')
    })
    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('input[name="username"]').type(testUser.username)
            cy.get('input[name="password"]').type(testUser.password)
            cy.contains('Login').click()

            cy.contains(`${testUser.name} is logged in`)
        })

        it('fails with wrong credentials', function () {
            cy.get('input[name="username"]').type("randomUser")
            cy.get('input[name="password"]').type("random password")
            cy.contains('Login').click()

            cy.contains('invalid username or password')
                .should('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')
        })
    })


    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: testUser.username, password: testUser.password })
        })
        it('A blog can be created', function () {
            cy.contains('new note').click()
            cy.get('input[name="title"]').type("this is a blog title")
            cy.get('input[name="author"]').type("Ernest Hemingway")
            cy.get('input[name="url"]').type("http://something.eu")

            cy.contains('Create Post').click()

            cy.contains('view').click()
            cy.contains('this is a blog title')
            cy.contains('Ernest Hemingway')
            cy.contains("http://something.eu")

        })
        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.request('POST', 'http://localhost:3003/api/testing/reset-blogs')
                cy.createPost({
                    title: 'A second blog title',
                    author: "Jon Keyns",
                    url: "Some random url"
                })
            })

            it('it can be liked', function () {
                cy.contains('A second blog title')
                    .contains('view').click()
                cy.contains('like').click()
                cy.contains('A second blog title').parent().contains("1")
            })

            it('it can be deleted', function () {
                cy.contains('A second blog title')
                    .contains('view').click()
                cy.contains('Remove').click()
                cy.should('not.contain', 'A second blog title')
            })
        })
        describe('when there are more that one blogs', function () {
            beforeEach(function () {
                cy.request('POST', 'http://localhost:3003/api/testing/reset-blogs')
                cy.createPost({
                    title: 'A first blog title',
                    author: "Jon Keyns",
                    url: "Some random url",
                })
                cy.createPost({
                    title: 'A second blog title',
                    author: "A second author",
                    url: "Some random url",
                })
            })

            it('it should sort posts according to their likes in descending order', function () {
                // assert that initially the post with the blog title "A first blog title" is 
                // the first and the post with the blog title "A second blog title is the second
                cy.get('[data-cy=post]').each((el, index) => {

                    if (index === 0) {
                        cy.wrap(el).contains('A first blog title')
                    }

                    if (index === 1) {
                        cy.wrap(el).contains('A second blog title')
                    }

                })

                // find the second blog post, expand it, and like it two times
                cy.contains('A second blog title')
                    .contains('view').click()
                cy.contains('like').as("secondLikeButton")

                cy.get('@secondLikeButton').click()
                cy.get('@secondLikeButton').click()

                // assert that the order of posts changed
                cy.get('[data-cy=post]').each((el, index) => {

                    if (index === 0) {
                        cy.wrap(el).contains('A second blog title')
                    }

                    if (index === 1) {
                        cy.wrap(el).contains('A first blog title')
                    }

                })
            })
        })
    })

})