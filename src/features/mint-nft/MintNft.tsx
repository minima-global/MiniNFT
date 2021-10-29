import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createImageNFT, createNFT, createUserImageNFT } from './mintNft.state'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'

// Type guards
function isBlob(blob: null | Blob): blob is Blob {
    return (blob as Blob).type !== undefined //TODO: will throw an error if null is passed anyway. (null.type => error)
}

function isString(myString: string | ArrayBuffer | null): myString is string {
    return (myString as string).length !== undefined // ArrayBuffer has byteLength property not length
}

const MintNft = () => {
    const dispatch = useAppDispatch()
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)
    const [myImageSrc, setMyImageSrc] = useState('')

    function createNftClicked() {
        dispatch(createNFT())
    }

    function createImageNftClicked() {
        dispatch(createImageNFT())
    }

    const Input = styled('input')({
        display: 'none',
    })

    const MyImage = styled('img')({
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    })

    const handleCapture = ({ target }: any) => {
        setSelectedFile(target.files[0])
        getDataUrlFromBlob(target.files[0]).then((imageDataUrl) => {
            setMyImageSrc(imageDataUrl)
        })
    }

    const createUserImageNftClicked = () => {
        console.log('create image from', selectedFile)
        if (isBlob(selectedFile)) {
            getDataUrlFromBlob(selectedFile).then((imageDataUrl) => {
                dispatch(createUserImageNFT(imageDataUrl))
            })
        } else {
            console.error('Error: Correct file type not selected')
        }
    }

    const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            var reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = function () {
                if (isString(reader.result)) {
                    resolve(reader.result)
                } else {
                    reject('Error: could not get data url from image')
                }
            }
        })
    }

    // either displays the image upload button
    // or if the image has already been selected,
    // displays the image
    const setImage = () => {
        if (myImageSrc === '') {
            return (
                <>
                    <InsertPhotoIcon sx={{ fontSize: 80 }} />
                    <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" onChange={handleCapture} />
                        <IconButton color="primary" aria-label="upload picture" component="span" size="large">
                            <AddIcon />
                        </IconButton>
                    </label>
                </>
            )
        } else {
            return <MyImage src={myImageSrc}></MyImage>
        }
    }

    return (
        <>
            <h1>Mint NFT</h1>
            <Stack alignItems="flex-start" spacing={2}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="40vh"
                    border="1px solid"
                    borderRadius="10px"
                    width="100%"
                    overflow="hidden"
                >
                    {setImage()}
                </Box>
                {/* <Button variant="contained" component="span" onClick={createNftClicked}>
                    Create NFT
                </Button>
                <Button variant="contained" component="span" onClick={createImageNftClicked}>
                    Create Image NFT
                </Button> */}
                {/* <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" onChange={handleCapture} />
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label> */}
                <Button variant="contained" component="span" onClick={createUserImageNftClicked}>
                    Create User Image NFT
                </Button>
            </Stack>
        </>
    )
}

export default MintNft
