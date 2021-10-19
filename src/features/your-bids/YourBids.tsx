import React, { useEffect } from 'react'
import BidsMade from './BidsMade'
import BidsReceived from './BidsReceived'
import BidsNothingToDoWithYou from './BidsNothingToDoWithYou'
import { useAppDispatch, useAppSelector } from './../../app/hooks'
import { listBidsMade, selectAllBids } from './bid.state'
import BidToken from './Bid'

const YourBids = () => {
    const dispatch = useAppDispatch()
    const bids: BidToken[] = useAppSelector(selectAllBids)

    const bidsMade: BidToken[] = []
    const bidsRecieved: BidToken[] = []
    const bidsNotMine: BidToken[] = []

    useEffect(() => {
        dispatch(listBidsMade())
    }, [dispatch])

    bids.forEach((bid) => {
        if (bid.madeBid) {
            bidsMade.push(bid)
        } else {
            if (bid.myToken) {
                bidsRecieved.push(bid)
            } else {
                bidsNotMine.push(bid)
            }
        }
    })

    const bidsMadeProps = {
        bids: bidsMade,
    }

    const bidsRecievedProps = {
        bids: bidsRecieved,
    }

    const bidsNotMineProps = {
        bids: bidsNotMine,
    }

    return (
        <>
            <h1>Your Bids</h1>
            <BidsMade {...bidsMadeProps}></BidsMade>
            <BidsReceived {...bidsRecievedProps}></BidsReceived>
            <BidsNothingToDoWithYou {...bidsNotMineProps}></BidsNothingToDoWithYou>
        </>
    )
}

export default YourBids
