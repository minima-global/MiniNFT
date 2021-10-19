import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { listAuctions, selectAllAuctions } from './marketplace.state'
import AuctionSummaryCard from './AuctionSummaryCard'

const Marketplace = () => {
    const dispatch = useAppDispatch()
    const auctions = useAppSelector(selectAllAuctions)

    useEffect(() => {
        dispatch(listAuctions())
    }, [dispatch])

    return (
        <>
            <h1>List all auctions ({auctions.length})</h1>
            {auctions.map((auction, i) => (
                <AuctionSummaryCard auction={auction}></AuctionSummaryCard>
            ))}
        </>
    )
}

export default Marketplace
