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
import { enqueueSnackbar } from './../../layout/notifications.state'
import TextField from '@mui/material/TextField'

// Type guards
function isBlob(blob: null | Blob): blob is Blob {
    return (blob as Blob) !== null && (blob as Blob).type !== undefined
}

function isString(myString: string | ArrayBuffer | null): myString is string {
    return (myString as string).length !== undefined // ArrayBuffer has byteLength property not length
}

const MintNft = () => {
    const dispatch = useAppDispatch()
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null)
    const [myImageSrc, setMyImageSrc] = useState('')
    const [nftName, setNftName] = useState('')

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

    const onNameChange = (event: any) => {
        setNftName(event.target.value)
    }

    const handleCapture = ({ target }: any) => {
        setSelectedFile(target.files[0])
        getDataUrlFromBlob(target.files[0]).then((imageDataUrl) => {
            setMyImageSrc(imageDataUrl)
        })
    }

    const createUserImageNftClicked = () => {
        if (isBlob(selectedFile)) {
            getDataUrlFromBlob(selectedFile).then((imageDataUrl) => {
                dispatch(createUserImageNFT({ imageDataUrl, nftName }))
            })
        } else {
            const imageSubmitFailure = {
                message: 'Image Upload Failure: No image selected',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                },
            }
            dispatch(enqueueSnackbar(imageSubmitFailure))
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

                <TextField label="Title" variant="outlined" value={nftName} onChange={onNameChange} />
                <Button variant="contained" component="span" onClick={createUserImageNftClicked}>
                    Create User Image NFT
                </Button>
            </Stack>
        </>
    )
}

export default MintNft
