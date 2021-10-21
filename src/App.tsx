import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import { useRoutes } from 'react-router-dom'
import Routes from './Routes'
import { useAppDispatch } from './app/hooks'
import { minimaInit } from './minima.init'
import NavigationBar from './layout/NavigationBar'

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(minimaInit())
    }, [dispatch])

    // helper hook to build the route componants from the Routes array
    const myRoutes = useRoutes(Routes)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavigationBar />
            {myRoutes}
        </ThemeProvider>
    )
}
export default App
