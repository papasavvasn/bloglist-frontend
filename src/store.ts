import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { notificationReducer } from './reducers/notificationReducer'
// import anecdoteReducer from './reducers/anecdoteReducer'
// import { filterReducer } from './reducers/filterReducer'

const reducer = combineReducers({
    // anecdotes: anecdoteReducer,
    notification: notificationReducer,
    // filter: filterReducer
})

export type RootState = ReturnType<typeof reducer>

export const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)