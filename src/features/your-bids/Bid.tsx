export default interface Bid {
    coin: string
    auctionTokenId: string
    bidderAddress: string
    bidderPubKey: string
    madeBid: boolean // flag to tell if you made the bid or someone else
    myToken: boolean // flag to tell if the bid is on one of your own tokens
}
