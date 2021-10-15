import React from 'react'
import Bid from './Bid'

interface IProps {
    bids: Bid[]
}

const BidsNothingToDoWithYou = ({ bids }: IProps) => {
    console.log('bids not mine', bids)
    return (
        <>
            <h2>Bids Nothin To Do With You</h2>
            {bids.map((bid, i) => (
                <div key={i}>
                    <div>coinId: {bid.coin}</div>
                    <div>tokenId: {bid.auctionTokenId}</div>
                </div>
            ))}
        </>
    )
}

export default BidsNothingToDoWithYou
