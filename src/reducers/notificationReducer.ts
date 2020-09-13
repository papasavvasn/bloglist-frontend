import { ActionCreator } from "redux"

const NOTIFICATION_TEXT = 'NOTIFICATION_TEXT'
const NOTIFICATION_VISIBILITY = 'NOTIFICATION_VISIBILITY'
const NOTIFICATION_TYPE = 'NOTIFICATION_TYPE'

export type Type = "success" | "error"

export interface NotificationReducerState {
    notificationText: string;
    isVisible: boolean;
    type: Type
}

interface Action {
    type: 'NOTIFICATION_TEXT' | 'NOTIFICATION_VISIBILITY' | 'NOTIFICATION_TYPE'
    payload: Partial<NotificationReducerState>
}

export const notificationReducer = (state: NotificationReducerState = { notificationText: "", isVisible: false, type: "success" }, action: Action): NotificationReducerState => {
    console.log('notification state now: ', state)
    console.log('action', action)

    switch (action.type) {
        case NOTIFICATION_TEXT:
            return { ...state, notificationText: action.payload.notificationText as string }
        case NOTIFICATION_VISIBILITY:
            return { ...state, isVisible: action.payload.isVisible as boolean }
        case NOTIFICATION_TYPE:
            return { ...state, type: action.payload.type as Type }
        default:
            return state
    }
}


export const setNotificationText = (notificationText = "") => ({
    type: NOTIFICATION_TEXT,
    payload: { notificationText }
})

export const setNotificationVisibility = (isVisible = false) => ({
    type: NOTIFICATION_VISIBILITY,
    payload: { isVisible }
})

export const setNotificationType = (type = "success") => ({
    type: NOTIFICATION_TYPE,
    payload: { type }
})

let timeoutID: number


export const setNotification = ({ notificationText, type, time }: { notificationText: string, type: Type, time: number }) => (dispatch: ActionCreator<Action>) => {
    if (timeoutID) clearTimeout(timeoutID)
    dispatch(setNotificationVisibility(true))
    dispatch(setNotificationText(notificationText))
    dispatch(setNotificationType(type))
    timeoutID = window.setTimeout(() => dispatch(setNotificationVisibility(false)), time * 1000)
}