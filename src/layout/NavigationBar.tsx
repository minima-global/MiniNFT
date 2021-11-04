import React, { useState } from 'react'

import { NavLink, Outlet, Link, useRoutes } from 'react-router-dom'
import NavbarRoutes from '../routes/navbar.routes'

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    MenuList,
    MenuItem,
    ListItemText,
    Button,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { useAppSelector } from './../app/hooks'
import { selectBlockNumber } from './../minima.init'
import Notifications from './Notifications'

const NavigationBar: React.FC = (props: any) => {
    const blockNumber = useAppSelector(selectBlockNumber)
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        setIsOpen(open)
    }

    const activeRoute = (routeName: any) => {
        return window.location.pathname === routeName ? true : false
    }

    const blockNumberString = blockNumber > 0 ? `Block Number ${blockNumber}` : 'Block Number ...'

    return (
        <div>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Nice Fucking Token
                        </Typography>
                        <Typography>{blockNumberString}</Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Drawer open={isOpen} onClose={toggleDrawer(false)}>
                <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <MenuList>
                        {NavbarRoutes.map((prop, key) => {
                            return (
                                <Link to={prop.path} style={{ textDecoration: 'none' }} key={key}>
                                    <MenuItem selected={activeRoute(prop.path)}>
                                        <ListItemText primary={prop.sidebarName} />
                                    </MenuItem>
                                </Link>
                            )
                        })}
                    </MenuList>
                </div>
            </Drawer>
            <Outlet></Outlet>
            <Notifications></Notifications>
        </div>
    )
}

export default NavigationBar
