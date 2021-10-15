import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Button from '@mui/material/Button'
import { bidOnAuction } from './marketplace.state'

const AuctionSummaryCard = (props: any) => {
    const dispatch = useAppDispatch()
    console.log(props)

    // TODO: create function on button click
    // dispatches bid event with auction as argument
    // TODO: create auction type
    function bidOnAuctionClicked(auction: any) {
        return () => {
            dispatch(bidOnAuction(auction))
        }
    }

    return (
        <>
            <div>{props.auction.token}</div>
            <div>{props.auction.tokenid}</div>
            <div>{props.auction.description}</div>
            <div>{props.auction.icon}</div>
            <div>
                {props.auction.own ? null : (
                    <Button onClick={bidOnAuctionClicked(props.auction)} variant="text">
                        Bid 2 Minima
                    </Button>
                )}
            </div>
        </>
    )
}

export default AuctionSummaryCard
