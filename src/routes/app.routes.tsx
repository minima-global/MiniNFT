import React from 'react'
import AuctionDetail from '../features/marketplace/auction-detail/AuctionDetail'

const AppRoutes = [
    {
        path: '/auction/:auctionCoinId',
        element: <AuctionDetail></AuctionDetail>,
    },
]

export default AppRoutes
