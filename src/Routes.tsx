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
        component: Marketplace,
    },
    {
        path: '/create',
        sidebarName: 'Mint/Create NFT',
        component: MintNft,
    },
    {
        path: '/wallet',
        sidebarName: 'NFT Wallet',
        component: NftWallet,
    },
    {
        path: '/myauctions',
        sidebarName: 'Your Auctions',
        component: YourAuctions,
    },
    {
        path: '/mybids',
        sidebarName: 'Your Bids',
        component: YourBids,
    },
]

export default Routes
