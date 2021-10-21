import React from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <HashRouter>
                    <App />
                </HashRouter>
            </SnackbarProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
