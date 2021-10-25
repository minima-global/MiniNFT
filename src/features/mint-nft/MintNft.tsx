import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createImageNFT, createNFT, createUserImageNFT } from './mintNft.state'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

// Type guards
function isBlob(blob: null | Blob): blob is Blob {
    return (blob as Blob).type !== undefined
}

function isString(myString: string | ArrayBuffer | null): myString is string {
    return (myString as string).length !== undefined // ArrayBuffer has byteLength property not length
}

const MintNft = () => {
    const dispatch = useAppDispatch()
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)

    function createNftClicked() {
        dispatch(createNFT())
    }

    function createImageNftClicked() {
        dispatch(createImageNFT())
    }

    const Input = styled('input')({
        display: 'none',
    })

    const handleCapture = ({ target }: any) => {
        setSelectedFile(target.files[0])
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

    return (
        <>
            <h1>Mint NFT</h1>
            <Stack alignItems="flex-start" spacing={2}>
                <Button variant="contained" component="span" onClick={createNftClicked}>
                    Create NFT
                </Button>
                <Button variant="contained" component="span" onClick={createImageNftClicked}>
                    Create Image NFT
                </Button>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" onChange={handleCapture} />
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>
                <Button variant="contained" component="span" onClick={createUserImageNftClicked}>
                    Create User Image NFT
                </Button>
            </Stack>
        </>
    )
}

export default MintNft
