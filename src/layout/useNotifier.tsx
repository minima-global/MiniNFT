import React from 'react'
import Button from '@mui/material/Button'
import { useAppDispatch, useAppSelector } from './../app/hooks'
import { useSnackbar } from 'notistack'
import { removeSnackbar, selectAllNotifications } from './notifications.state'

// Code based off example from notistack docs https://iamhosseindhv.com/notistack/demos#redux-/-mobx-example

let displayed: any[] = []

const useNotifier = () => {
    const dispatch = useAppDispatch()
    const notifications = useAppSelector(selectAllNotifications)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const storeDisplayed = (id: any) => {
        displayed = [...displayed, id]
    }

    const removeDisplayed = (id: any) => {
        displayed = [...displayed.filter((key) => id !== key)]
    }

    React.useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key)
                return
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey)
                    }
                },
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(removeSnackbar(myKey))
                    removeDisplayed(myKey)
                },
            })

            // keep track of snackbars that we've displayed
            storeDisplayed(key)
        })
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])
}

export default useNotifier
