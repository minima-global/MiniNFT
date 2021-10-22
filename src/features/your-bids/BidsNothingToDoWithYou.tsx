import React from 'react'
import Bid from './Bid'
import BidCard from './BidCard'

interface IProps {
    bids: Bid[]
}

const BidsNothingToDoWithYou = ({ bids }: IProps) => {
    return (
        <>
            <h2>Bids Nothin To Do With You ({bids.length})</h2>
            {bids.map((bid, i) => (
                <BidCard bid={bid} key={i}></BidCard>
            ))}
        </>
    )
}

export default BidsNothingToDoWithYou
