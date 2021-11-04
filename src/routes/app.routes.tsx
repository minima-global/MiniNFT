import React from 'react'
import AuctionDetail from './../features/marketplace/AuctionDetail'

const AppRoutes = [
    {
        path: '/auction/:auctionCoinId',
        element: <AuctionDetail></AuctionDetail>,
    },
]

export default AppRoutes
