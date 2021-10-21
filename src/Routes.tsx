import React from 'react'
import Marketplace from './features/marketplace/Marketplace'
import MintNft from './features/mint-nft/MintNft'
import NftWallet from './features/nft-wallet/NftWallet'
import YourAuctions from './features/your-auctions/YourAuctions'
import YourBids from './features/your-bids/YourBids'

const Routes = [
    {
        path: '/',
        sidebarName: 'Marketplace',
        element: <Marketplace></Marketplace>,
    },
    {
        path: '/create',
        sidebarName: 'Mint/Create NFT',
        element: <MintNft></MintNft>,
    },
    {
        path: '/wallet',
        sidebarName: 'NFT Wallet',
        element: <NftWallet></NftWallet>,
    },
    {
        path: '/myauctions',
        sidebarName: 'Your Auctions',
        element: <YourAuctions></YourAuctions>,
    },
    {
        path: '/mybids',
        sidebarName: 'Your Bids',
        element: <YourBids></YourBids>,
    },
]

export default Routes
