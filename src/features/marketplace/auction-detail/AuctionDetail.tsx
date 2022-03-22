import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectAuctionByCoinId } from '../marketplace.state'
import AuctionDetailCard from './AuctionDetailCard'

const AuctionDetail = () => {
    const params = useParams()
    const navigate = useNavigate()

    const auctionCoinId = params.auctionCoinId || ''

    // will return either an array with the single auction in it [selectedAuction], or empty array []
    const auctionArray = useAppSelector(selectAuctionByCoinId(auctionCoinId))

    if (auctionArray.length === 0) {
        navigate('/')
        return <h1>Auction Detail Error: {auctionCoinId} auction not found</h1>
    } else {
        const auction = auctionArray[0]
        return (
            <>
                <h1>{auction.token}</h1>
                <AuctionDetailCard auction={auction}></AuctionDetailCard>
            </>
        )
    }
}

export default AuctionDetail
