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
            cy.contains('invalid username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })
})