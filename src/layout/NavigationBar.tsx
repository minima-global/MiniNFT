import React, { useState } from 'react'

import { NavLink, withRouter } from 'react-router-dom'
import Routes from './../Routes'

import { AppBar, Toolbar, Typography, IconButton, Drawer, MenuList, MenuItem, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const NavigationBar: React.FC = (props: any) => {
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
        return props.location.pathname === routeName ? true : false
    }

    return (
        <div>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">Nice Fucking Tits</Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Drawer open={isOpen} onClose={toggleDrawer(false)}>
                <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <MenuList>
                        {Routes.map((prop, key) => {
                            return (
                                <NavLink to={prop.path} style={{ textDecoration: 'none' }} key={key}>
                                    <MenuItem selected={activeRoute(prop.path)}>
                                        <ListItemText primary={prop.sidebarName} />
                                    </MenuItem>
                                </NavLink>
                            )
                        })}
                    </MenuList>
                </div>
            </Drawer>
        </div>
    )
}

export default withRouter(NavigationBar)
