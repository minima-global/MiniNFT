import React from 'react'
import Bid from './Bid'
import BidCard from './BidCard'

interface IProps {
    bids: Bid[]
}

const BidsNothingToDoWithYou = ({ bids }: IProps) => {
    console.log('bids not mine', bids)
    return (
        <>
            <h2>Bids Nothin To Do With You</h2>
            {bids.map((bid, i) => (
                <BidCard bid={bid} key={i}></BidCard>
            ))}
        </>
    )
}

export default BidsNothingToDoWithYou
