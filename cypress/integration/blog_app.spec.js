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

    // it('Login form is shown', function () {
    //     cy.contains('Log in to application')
    //     cy.contains('Username')
    //     cy.contains('Password')
    // })
    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('input[name="username"]').type(testUser.username)
            cy.get('input[name="password"]').type(testUser.password)
            cy.contains('Login').click()

            cy.contains(`${testUser.name} is logged in`).click()
        })

        it('fails with wrong credentials', function () {
            // ..
        })
    })
})