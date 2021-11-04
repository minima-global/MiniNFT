import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import { useRoutes } from 'react-router-dom'
import NavbarRoutes from './routes/navbar.routes'
import AppRoutes from './routes/app.routes'
import { useAppDispatch } from './app/hooks'
import { minimaInit } from './minima.init'
import NavigationBar from './layout/NavigationBar'
import Container from '@mui/material/Container'

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(minimaInit())
    }, [dispatch])

    const allRoutes = (NavbarRoutes as any[]).concat(AppRoutes)
    // helper hook to build the route componants from the Routes array
    const myRoutes = useRoutes(allRoutes)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavigationBar />
            <Container maxWidth="xl">{myRoutes}</Container>
        </ThemeProvider>
    )
}
export default App
