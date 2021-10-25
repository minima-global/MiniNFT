import { Minima, NetworkStatus, Address, Coin, Token } from 'minima'
import BidToken from './features/your-bids/Bid'

// Everything minima related in this app should do through this service
// Not calling minima library directly

function initializeMinima(callBack: (res: any) => void) {
    Minima.init(callBack)
}

/**
 * Register Auction Script
 * @returns Hexaddress of script
 */
function createAuctionContract() {
    return new Promise((resolve, reject) => {
        const auctionAddressString = `extrascript "LET mkey = PREVSTATE ( 23 ) RETURN SIGNEDBY ( mkey )"`
        Minima.cmd(auctionAddressString, (res) => {
            // console.log(res)
            console.log('Set Auction Script!')
            let hex = res.response.address.hexaddress
            resolve(hex)
        })
    })
}

/**
 * Register Bidder Script
 * @returns Hexaddress of script
 *
 *
 *  VERIFYOUT ( NUMBER HEX NUMBER HEX )
 *  Verify the specified output has the specified address, amount and tokenid
 */
function createBidContract() {
    return new Promise((resolve, reject) => {
        const bidScript =
            'extrascript "LET bidderpubkey  = PREVSTATE(0) ' +
            'LET bidderaddress = PREVSTATE(1) ' +
            'LET token = PREVSTATE(2) ' +
            'IF SIGNEDBY ( bidderpubkey ) AND @BLKDIFF GT 100 ' +
            'THEN RETURN TRUE ' +
            'ENDIF ' +
            'RETURN VERIFYOUT (@INPUT bidderaddress 1 token) "'
        Minima.cmd(bidScript, (res) => {
            // console.log(res)
            console.log('Set Bidder Script!')
            let hex = res.response.address.hexaddress
            resolve(hex)
        })
    })
}

/**
 * Create User HexAddress
 * @returns Promise<string>
 */
function newAddress(): Promise<string> {
    return new Promise(function (resolve, reject) {
        Minima.cmd('newaddress', function (res) {
            if (res.status) {
                let addr: string = res.response.address.hexaddress
                resolve(addr)
            }
        })
    })
}

/**
 * Create User Public Key
 * @returns Promise<string>
 */
function newKey() {
    return new Promise(function (resolve, reject) {
        Minima.cmd('keys new', function (res) {
            if (res.status) {
                let key: string = res.response.key.publickey
                resolve(key)
            }
        })
    })
}

function isYourAddressOrKey(addressOrKey: string) {
    return new Promise(function (resolve, reject) {
        const command = `check ${addressOrKey}`
        Minima.cmd(command, function (res) {
            if (res.status && res.response && res.response.relevant) {
                resolve(res.response)
            } else {
                reject(res)
            }
        })
    })
}

// returns an array of objects that looks like
// {
//     "script": "RETURN SIGNEDBY ( 0x54BE088D5617F1C6401EA25C862B1DC04E9593C2 )",
//     "hexaddress": "0xEF8B4D9FCDFA980EA0D86FD13C4A77AD439C0B71",
//     "miniaddress": "Mx56FU3H6N7KMA5IGYN7ITYSTXVVBZYC3R"
//  }
function getAllYourAddresses(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const command = 'scripts'
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.addresses) {
                const addresses = res.response.addresses
                resolve(addresses)
            } else {
                reject(res)
            }
        })
    })
}

function getAllYourPublicKeys() {
    return new Promise((resolve, reject) => {
        const command = 'keys'
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.publickeys) {
                const myKeys = res.response.publickeys.map((key: any) => key.publickey)
                resolve(myKeys)
            } else {
                reject(res)
            }
        })
    })
}

// gets details of all the tokens your node knows about
// eg name, description, icon, decimals etc
function getAllKnownTokens(): Promise<Token[]> {
    return new Promise((resolve, reject) => {
        const command = 'tokens'
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.tokens) {
                resolve(res.response.tokens)
            } else {
                reject(res)
            }
        })
    })
}

// geta all auctions with a flag to tell if each auction is
// your own (not biddable) or someone elses (biddable)
async function getAllAuctions(auctionContractAddress: string) {
    const [allAuctions, ownAuctions] = await Promise.all([
        listAllAuctions(auctionContractAddress, false),
        listAllAuctions(auctionContractAddress, true),
    ])

    const allAuctionsUpdated = allAuctions.map((auction) => {
        const foundOwn = ownAuctions.find((ownAuction) => auction.coin === ownAuction.coin)
        let own = true
        if (typeof foundOwn === 'undefined') {
            own = false
        }
        return {
            ...auction,
            own,
        }
    })
    return allAuctionsUpdated
}

// gets all auctions, with extra data added
// such as name, description, icon etc
// objects returned from this function will have different shapes
// depending on weather they are known or not
// If known they will have extra properties (name, description, icon etc)
async function getAllAuctionsWithData(auctionContractAddress: string) {
    const allAuctions = await getAllAuctions(auctionContractAddress)
    const allKnownTokens = await getAllKnownTokens()
    const allAuctionsUpdated = allAuctions.map((auction) => {
        const auctionTokenKnown = allKnownTokens.find((token) => token.tokenid === auction.tokenid)
        if (typeof auctionTokenKnown === 'undefined') {
            return { ...auction }
        } else {
            return {
                ...auction,
                ...auctionTokenKnown,
            }
        }
    })
    return allAuctionsUpdated
}

// list all the NFTs (coinid and tokenid), listed in the auction
function listAllAuctions(auctionContractAddress: string, justMine: boolean): Promise<any[]> {
    listAllAuctionsTxPow(auctionContractAddress)
    return new Promise((resolve, reject) => {
        let command = 'coins address:' + auctionContractAddress
        if (justMine) {
            command = command + ' relevant:true'
        }
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.coins) {
                const nfts = res.response.coins.map((c: any) => {
                    return {
                        coin: c.data.coin.coinid,
                        tokenid: c.data.coin.tokenid,
                    }
                })
                resolve(nfts)
            } else {
                reject(res)
            }
        })
    })
}

// Uses txpowsearch command to get tokens in auction contract
function listAllAuctionsTxPow(auctionContractAddress: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const command = `txpowsearch output:${auctionContractAddress}`
        Minima.cmd(command, (res) => {
            const tokens = res.response.txpowlist.map((aTxPow: any) => {
                return aTxPow.txpow.body.witness.tokens[0]
            })
            resolve(tokens)
        })
    })
}

// compare the tokenIds returned from txpowsearch and coin commands
async function compareTokenLists(auctionContractAddress: string) {
    const txpowTokens = await listAllAuctionsTxPow(auctionContractAddress)
    const coinTokens = await listAllAuctions(auctionContractAddress, false)
    const txPowTokenIds = txpowTokens.map((t) => t.tokenid)
    const coinTokenIds = coinTokens.map((t) => t.tokenid)

    const comparison: any = {
        allTxPowTokens: txPowTokenIds,
        allCoinTokens: coinTokenIds,
        compare: {
            bothLists: [],
            onlyTxPow: [],
            onlyCoin: [],
        },
    }

    comparison.compare.bothLists = txPowTokenIds.filter((id) => coinTokenIds.includes(id))
    comparison.compare.onlyTxPow = txPowTokenIds.filter((id) => !coinTokenIds.includes(id))
    comparison.compare.onlyCoin = coinTokenIds.filter((id) => !txPowTokenIds.includes(id))

    return comparison
}

// list all the bids (coinid and tokenid), listed in the bid contract
function listAllBids(bidsContractAddress: string, justMine: boolean): Promise<any[]> {
    const minimaTokenId = '0x00'
    return new Promise((resolve, reject) => {
        let command = `coins address:${bidsContractAddress} tokenid:${minimaTokenId}`
        if (justMine) {
            command = command + ' relevant:true'
        }
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.coins) {
                const bids = res.response.coins.map((c: any) => {
                    // TODO: create bid object here
                    return {
                        coin: c.data.coin.coinid,
                        auctionTokenId: c.data.prevstate[2].data,
                        bidderAddress: c.data.prevstate[1].data,
                        bidderPubKey: c.data.prevstate[0].data,
                    }
                })
                resolve(bids)
            } else {
                reject(res)
            }
        })
    })
}

// get all bids with a flag to tell if each bid is
// a bid you made, bid you received, or nothing to do with you
// madeBid flag is added if its a bid you made
async function getAllBidsYouHaveMade(bidContractAddress: string) {
    const [allBids, relevantBids] = await Promise.all([
        listAllBids(bidContractAddress, false),
        listAllBids(bidContractAddress, true),
    ])
    const allBidsUpdated = allBids.map((bid) => {
        const foundRelevant = relevantBids.find((relevantBid) => bid.coin === relevantBid.coin)
        let madeBid = false
        if (typeof foundRelevant !== 'undefined') {
            madeBid = true
        }
        return {
            ...bid,
            madeBid,
        }
    })
    return allBidsUpdated
}

// gets all bids
// with a flag added that tells you if its YOUR NFT token
// owner = true/false
async function getAllBidsWithTokenOwner(bidContractAddress: string) {
    const [allBids, allMyTokens] = await Promise.all([getAllBidsYouHaveMade(bidContractAddress), getAllMyTokens()])
    const allBidsWithTokenOwner = allBids.map((bid) => {
        const foundBidForYourToken = allMyTokens.find((myToken) => myToken.tokenid === bid.auctionTokenId)
        let myToken = false
        if (typeof foundBidForYourToken !== 'undefined') {
            myToken = true
        }
        return {
            ...bid,
            myToken,
        }
    })
    return allBidsWithTokenOwner
}

// gets all bids and adds data about the token bidded on
// like name, description, icon etc
// this means some bids will have a different object shape to others
// depending on if we know this extra data ot not
async function getAllBidsOwnedWithData(bidContractAddress: string) {
    const allBids = await getAllBidsWithTokenOwner(bidContractAddress)
    const allKnownTokens = await getAllKnownTokens()
    const allBidsUpdated = allBids.map((bid) => {
        const bidTokenKnown = allKnownTokens.find((token) => token.tokenid === bid.auctionTokenId)
        if (typeof bidTokenKnown === 'undefined') {
            return { ...bid }
        } else {
            return {
                ...bid,
                ...bidTokenKnown,
            }
        }
    })
    return allBidsUpdated
}

//////////////// Seller /////////////////////////////////////////

/**
 * Seller Create Auction
 * @param {*} scriptAddress
 * @param {*} myNftTokenId
 * @param {*} publicKey
 * @returns Promise<boolean>
 */
function createAuction(auctionScriptAddress: string, myTokenId: string, publicKey: string) {
    return new Promise((resolve, reject) => {
        let command = `send 1 ${auctionScriptAddress} ${myTokenId} 23:${publicKey}`
        Minima.cmd(command, (res) => {
            if (res.status) {
                resolve(res.message)
            } else {
                reject(res.message)
            }
        })
    })
}

/**
 * Cancel Auction
 * @param {*} nftCoinId
 * @param {*} selfAddress
 * @param {*} nftTokenId
 * @param {*} pubKeyUsedInScript
 * @param {*} scale
 * Remove token from auction smart contract
 */
function cancelAuction(
    nftCoinId: string,
    selfAddress: string,
    nftTokenId: string,
    pubKeyUsedInScript: string,
    scale: number
) {
    let minimaAmount = 1 / Math.pow(10, scale)
    let command = `txncreate 10;
        txninput 10 ${nftCoinId};
        txnoutput 10 ${minimaAmount} ${selfAddress} ${nftTokenId};
        txnsign 10 ${pubKeyUsedInScript};
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
}

/**
 * Get Updated CoinId
 * @param {*} zTokenId
 * @returns Promise<String>
 *
 *
 * TODO: There can be multiple coins with that tokenId.
 * How do we find the correct one
 */
function getCoinId(zTokenId: string) {
    return new Promise((resolve, reject) => {
        if (typeof zTokenId === 'undefined') {
            reject('No token id submitted')
        }
        let command = `coins tokenid:${zTokenId} relevant:true`
        Minima.cmd(command, (res) => {
            console.log(res)
            // only resolve if we have exactly 1 coin id
            if (res.status && res.response && res.response.coins && res.response.coins.length === 1) {
                const mCoinId = res.response.coins[0].data.coin.coinid
                resolve(mCoinId)
            } else {
                reject(res)
            }
        })
    })
}

function selectBid(acceptedBidIndex: number, bidder_script_accress: string, publicKey: string) {
    listAllBids(bidder_script_accress, false).then((bids: any) => {
        const selectedBid = bids[acceptedBidIndex]
        newAddress().then((myNewAddress: string) => {
            acceptBid(
                selectedBid.tokenidIWantToBuy,
                myNewAddress,
                selectedBid.coin,
                selectedBid.bidderAddress,
                2,
                44,
                publicKey
            )
        })
    })
}

function acceptThisBid(selectedBid: BidToken, myAddress: string, myKey: string) {
    return acceptBid(selectedBid.auctionTokenId, myAddress, selectedBid.coin, selectedBid.bidderAddress, 2, 44, myKey)
}

// The Host accepts bid of bidder
function acceptBid(
    nftTokenId: string,
    sellerAddress: string,
    minimaBidCoinId: string,
    buyerAddress: string,
    minimaAmountBid: number,
    scale: number,
    publicKey: string
) {
    return new Promise((resolve, reject) => {
        let minimaAmountNFT = 1 / Math.pow(10, scale)
        let minimaTokenId = '0x00'
        getCoinId(nftTokenId).then((nftCoinId) => {
            // const bidContractCoinId = await getCoinIdFromBidContract(bidContract, buyerAddress)

            // 1st input is the bid contract (Minima).. 1st output is the NFT sent to the bidder
            // 2nd input is the NFT token..  2nd output is the Minima sent to the seller
            let command = `txncreate 10;
                txninput 10 ${minimaBidCoinId};
                txninput 10 ${nftCoinId};
                txnoutput 10 ${minimaAmountNFT} ${buyerAddress} ${nftTokenId};
                txnoutput 10 ${minimaAmountBid} ${sellerAddress} ${minimaTokenId};
                txnsign 10 ${publicKey};
                txnpost 10;
                txndelete 10`
            Minima.cmd(command, (responsesArray) => {
                console.log(responsesArray)
                // res is an array of responses for each txninput
                // find the one with txn post
                const txnPost = responsesArray.find((res: any) => res.minifunc && res.minifunc === 'txnpost 10')
                if (typeof txnPost === 'undefined') {
                    reject('Error: No txnpost found')
                } else {
                    if (txnPost.status && txnPost.message === 'Send Success') {
                        resolve(txnPost.message)
                    } else {
                        reject(txnPost.message)
                    }
                }
            })
        })
    })
}

// VERIFYOUT ( NUMBER HEX NUMBER HEX )
// Verify the specified output has the specified address, amount and tokenid
// 'RETURN VERIFYOUT (1 bidderaddress 0.00000000000000000000000000000000000000000001 token) "';

// can use transaction validate to test
function acceptABid(
    myCoinID: string,
    myTokenID: string,
    myAddress: string,
    bidAmount: number,
    bidCoinID: string,
    bidderAddress: string,
    publicKey: string
) {
    // txninput 10 ${bidCoinID} 0;
    // txnoutput 10 ${bidAmount} ${myAddress} ${MINIMA} 0;
    const MINIMA = '0x00'
    let command = `txncreate 10;
        txninput 10 ${bidCoinID};
        txninput 10 ${myCoinID};
        txnoutput 10 0.00000000000000000000000000000000000000000001 ${bidderAddress} ${myTokenID};
        txnoutput 10 ${bidAmount} ${myAddress} ${MINIMA};
        txnsign 10 ${publicKey};
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
}

async function getCoinIdFromBidContract(bidContract: string, buyerAddress: string) {
    const bidContractCoin: any = await getCoinFromBidContract(bidContract, buyerAddress)
    return bidContractCoin.data.coin.coinid
}

// gets the coinId of the minima tokens the bidder has
// locked up in the bid contract
// We need a way to identify this particular bid
// from all the different bids in the bid contract (buyerAddress)
// TODO: Buyer address may not be unique in the bid contract
// if they have sent multiple bids from the same address
function getCoinFromBidContract(bidContractAddress: string, buyerAddress: string) {
    return new Promise((resolve, reject) => {
        getCoinsFromAddress(bidContractAddress).then((coins: any) => {
            const foundBidCoin = coins.find((coin: any) => coin.data.prevstate[1].data === buyerAddress) // TODO: will prevstate[1] always be port 1 ????
            if (typeof foundBidCoin !== 'undefined') {
                resolve(foundBidCoin)
            } else {
                reject(`Error: ${buyerAddress} wallet does not exist in contract ${bidContractAddress}`)
            }
        })
    })
}

// Use this to get the coins in a smart contract
function getCoinsFromAddress(address: string) {
    return new Promise((resolve, reject) => {
        const command = `coins address:${address}`
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.coins) {
                resolve(res.response.coins)
            } else {
                reject(res)
            }
        })
    })
}

// get all my tokens
// sendable or locked up
function getAllMyTokens(): Promise<Token[]> {
    return new Promise((resolve, reject) => {
        const command = 'balance'
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.balance) {
                const nfts: Token[] = res.response.balance
                resolve(nfts)
            } else {
                reject(res)
            }
        })
    })
}

function getAllMyNFTs(): Promise<Token[]> {
    return new Promise((resolve, reject) => {
        const command = 'balance'
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.balance) {
                const nfts: Token[] = res.response.balance.filter(isCoinNFTAndSendable)
                resolve(nfts)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * @param coin
 * @returns true if the coins is an NFT.
 */
function isCoinNFTAndSendable(coin: Token) {
    return coin.decimals === '0' && parseInt(coin.sendable) > 0
}

/**
 * @param nameStr
 * @returns void
 * Creates an NFT with the given name,
 * or a random name if none is given
 */
function createNFT(nameStr?: string) {
    return new Promise((resolve, reject) => {
        let nftName = (Math.random() + 1).toString(36).substring(7)
        nftName = 'NFT-' + nftName
        if (typeof nameStr !== 'undefined') {
            nftName = nameStr
        }
        const command = `tokencreate name:${nftName} amount:1.0`
        Minima.cmd(command, (res) => {
            if (
                res.status &&
                res.response &&
                res.response.txpow &&
                res.response.txpow.body &&
                res.response.txpow.body.txn &&
                res.response.txpow.body.txn.tokengen
            ) {
                resolve(res.response.txpow.body.txn.tokengen)
            } else {
                reject(res.message)
            }
        })
    })
}

function createNFTWithImage(encodedImage: string, nameStr?: string): Promise<string | Token> {
    return new Promise((resolve, reject) => {
        let nftName = (Math.random() + 1).toString(36).substring(7)
        nftName = 'NFT-' + nftName
        if (typeof nameStr !== 'undefined') {
            nftName = nameStr
        }
        // const encodedImageJSON = JSON.stringify({ artImage: encodedImage })

        var xmlString = '<artimage></artimage>'
        var parser = new DOMParser()
        var xmlDoc: any = parser.parseFromString(xmlString, 'text/xml')
        xmlDoc.firstElementChild.innerHTML = encodedImage
        var serializer = new XMLSerializer()
        var imageXmlString = serializer.serializeToString(xmlDoc)

        const command = `tokencreate name:${nftName} amount:1.0 description:${imageXmlString}`

        Minima.cmd(command, (res) => {
            if (
                res.status &&
                res.response &&
                res.response.txpow &&
                res.response.txpow.body &&
                res.response.txpow.body.txn &&
                res.response.txpow.body.txn.tokengen
            ) {
                resolve(res.response.txpow.body.txn.tokengen)
            } else {
                reject(res.message)
            }
        })
    })
}

////////////// Bidder //////////////////////

function createBidTransaction(
    amount: number,
    scriptAddress: string,
    myAddress: string,
    myPubKey: string,
    tokenIdIWant: string
) {
    return new Promise((resolve, reject) => {
        const minimaTokenId = '0x00'
        const sendTransaction = `send ${amount} ${scriptAddress} ${minimaTokenId} 0:${myPubKey}#1:${myAddress}#2:${tokenIdIWant}`
        Minima.cmd(sendTransaction, (res) => {
            if (res.status && res.message === 'Send Success') {
                resolve(res.message)
            } else {
                reject(res.message)
            }
        })
    })
}

/////////// Art Work /////////////////////////

function buildUserNFT(imageDataUrl: string, compressionFactor: number, nameStr?: string): Promise<string | Token> {
    return resizeImage(imageDataUrl, compressionFactor).then((resizedImageDataUrl) => {
        console.log('resizedImageDataUrl', resizedImageDataUrl)
        const onlyString = resizedImageDataUrl.slice(resizedImageDataUrl.indexOf(',') + 1)
        return createNFTWithImage(onlyString, nameStr)
    })
}

function resizeImage(imageDataUrl: string, compressionFactor: number): Promise<string> {
    return new Promise((resolve, reject) => {
        let imageNode = document.createElement('img')
        imageNode.src = imageDataUrl
        let canvas: any = document.createElement('canvas')

        var ctx = canvas.getContext('2d')

        imageNode.addEventListener(
            'load',
            function () {
                // execute drawImage statements here
                // ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height)

                canvas.width = 300
                canvas.height = 150
                ctx.drawImage(imageNode, 0, 0, imageNode.width, imageNode.height, 0, 0, canvas.width, canvas.height)

                let url = ''
                url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
                canvas = null // or some way to destroy the element

                resolve(url)
            },
            false
        )
    })
}

function buildNFT(nameStr?: string): Promise<string | Token> {
    return getResizedImage(0.2).then(
        (encoded) => {
            // console.log('NFT image string', encoded)
            const onlyString = encoded.slice(encoded.indexOf(',') + 1)
            return createNFTWithImage(onlyString, nameStr)
        },
        (err: any) => JSON.stringify(err)
    )
}

function getResizedImage(compressionFactor: number): Promise<string> {
    // Read the files using the HTML5 FileReader API with .readAsArrayBuffer

    // Create a Blob with the file data and get its url with window.URL.createObjectURL(blob)

    // Create new Image element and set it's src to the file blob url

    // Send the image to the canvas. The canvas size is set to desired output size

    // Get the scaled-down data back from canvas via canvas.toDataURL("image/jpeg",0.7) (set your own output format and quality)

    // Attach new hidden inputs to the original form and transfer the dataURI images basically as normal text

    // On backend, read the dataURI, decode from Base64, and save it

    return getArtDataUrl().then(
        (imageUrl: string) => {
            let imageNode = document.createElement('img')
            imageNode.src = imageUrl
            // let canvas: any = document.getElementById('canvas')
            // const div = document.getElementById('imageDiv')
            // div.appendChild(imageNode)
            // console.log('load and display image with javascript')

            let canvas: any = document.createElement('canvas')

            let width = imageNode.width
            let height = imageNode.height

            var ctx = canvas.getContext('2d')
            ctx.drawImage(imageNode, 0, 0, 300, 150)

            // ctx.fillStyle = 'green';
            // ctx.fillRect(10, 10, 150, 100);

            let url = ''
            url = canvas.toDataURL('image/jpeg', compressionFactor) // get the data from canvas as 70% JPG (can be also PNG, etc.)
            canvas = null // or some way to destroy the element

            return url
        },
        (err: any) => JSON.stringify(err)
    )
}

function getArtDataUrl(): Promise<any> {
    return new Promise((resolve, reject) => {
        getArt().then((imageBlob) => {
            var reader = new FileReader()

            reader.onload = function () {
                // console.log(reader.result)
                resolve(reader.result)
            }

            reader.readAsDataURL(imageBlob)
        })
    })
}

// Build url like so
// '/minidapps/0x97E1C726F39DDAFE82599F1A3864DE35A4EC3FA6/NFT-non-fungible-token.2-810x524.jpg'
function getArt() {
    const origin = window.location.origin + '/'
    const fileName = 'NFT-non-fungible-token.2-810x524.jpg'
    const indexPath = window.location.pathname
    const minidapps = indexPath.split('/')[1]
    const appId = indexPath.split('/')[2]
    const basePath = `${minidapps}/${appId}/`

    return fetch(origin + basePath + fileName).then((response) => response.blob())
}

const Minima_Service = {
    initializeMinima,
    newAddress,
    newKey,
    createAuctionContract,
    createBidContract,
    getAllAuctionsWithData,
    getAllBidsOwnedWithData,
    getAllMyNFTs,
    createAuction,
    createBidTransaction,
    acceptThisBid,
    compareTokenLists,
    buildNFT, // with image
    createNFT, // without image
    buildUserNFT, // with user image
}

export default Minima_Service

// re-export types
export type { Token }
