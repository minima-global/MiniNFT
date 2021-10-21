import { createAsyncThunk, createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState, AppThunk } from './../app/store'

export interface NotificationsState {
    notifications: any[]
}

const initialNotificationsState: NotificationsState = {
    notifications: [],
}

export const notificationsSlice = createSlice({
    name: 'appInit',
    initialState: initialNotificationsState,
    reducers: {
        enqueueSnackbar: (state, action) => {
            // action.payload is the notification to add
            const key = action.payload.options && action.payload.options.key
            const notification = {
                ...action.payload,
                key: key || new Date().getTime() + Math.random(),
            }
            state.notifications.push(notification)
        },
        closeSnackbar: (state, action) => {
            // action.payload.key is the key for the snackbar to close
            // or action.payload.dismissAll : true to dismiss all
            state.notifications = state.notifications.map((notification) =>
                action.payload.dismissAll || notification.key === action.payload.key
                    ? { ...notification, dismissed: true }
                    : { ...notification }
            )
        },
        removeSnackbar: (state, action) => {
            // action.payload is the key for the snackbar to remove
            state.notifications = state.notifications.filter((notification) => notification.key !== action.payload)
        },
    },
})

const notificationsActions = notificationsSlice.actions
const notificationsReducer = notificationsSlice.reducer

// export reducers and actions
export const { enqueueSnackbar, closeSnackbar, removeSnackbar } = notificationsActions
export default notificationsReducer

// selectors
const selectNotifications = (state: RootState): NotificationsState => {
    return state.notifications
}
export const selectAllNotifications = createSelector(
    selectNotifications,
    (notifications: NotificationsState) => notifications.notifications
)
