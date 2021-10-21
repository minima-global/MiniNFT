import react from 'react'
import Button from '@mui/material/Button'
import { useAppDispatch } from './../app/hooks'
import useNotifier from './useNotifier'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from './notifications.state'

const Notifications = () => {
    useNotifier()
    const dispatch = useAppDispatch()
    const enqueueSnackbar = (notification: any) => dispatch(enqueueSnackbarAction(notification))
    const closeSnackbar = (keys?: any) => dispatch(closeSnackbarAction(keys))

    const handleClick = () => {
        // NOTE:
        // if you want to be able to dispatch a `closeSnackbar` action later on,
        // you SHOULD pass your own `key` in the options. `key` can be any sequence
        // of number or characters, but it has to be unique for a given snackbar.
        enqueueSnackbar({
            message: 'Failed fetching data.',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'warning',
                action: (key: any) => <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>,
            },
        })
    }

    const handleDimissAll = () => {
        closeSnackbar()
    }

    return (
        <>
            <Button onClick={handleClick}>Open simple snackbar</Button>
        </>
    )
}

export default Notifications
