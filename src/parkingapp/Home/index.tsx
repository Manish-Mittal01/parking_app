import React, { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addParkingLots, addLotDetails, updateLotStatus, parkingState, lotStatus, canCarEnter } from '../store/parkings';
import { useNavigate } from 'react-router-dom'
import store from '../store/store';
import {
    TextField,
    Button,
    Stack,
    Typography,
    ImageList,
    ImageListItem
} from '@mui/material';
import styles from './Home.module.css'

export interface State {
    getData: parkingState
}

export default function Home() {
    const [totalLot, setTotalLot] = useState<number | "">("");
    const [registrationNumber, setRegistrationNumber] = useState<string>("");

    const navigate = useNavigate();

    const selector = useSelector((state: State) => state.getData);
    type dispatchType = typeof store.dispatch
    const dispatch = useDispatch<dispatchType>();

    const addSpaces = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.value ? setTotalLot(parseInt(e.target.value)) : setTotalLot("");
    }

    const addLots = () => {
        dispatch(addParkingLots(totalLot));
        dispatch(canCarEnter(2))
    }

    const allotALot = () => {
        const max = Number(totalLot);
        const min = 0;
        let index = Math.floor(Math.random() * (max - min) + min);
        const spaces = selector.lot_status.filter(item => item.includes(lotStatus.available));
        if (spaces.length > 0) {
            if (selector.lot_status[index].includes(lotStatus.booked)) {
                allotALot();
            }
            else {
                dispatch(updateLotStatus(index));
                dispatch(addLotDetails({ index: index, reg: registrationNumber }))
            }
        }
        else {
            dispatch(canCarEnter(1))
        }
        setRegistrationNumber("")
    }

    const showLotDetails = (lot: string) => {
        if (lot.includes(lotStatus.booked))
            navigate(`/parkinglot/${lot.split(" ", 1)}`)
    }

    return (
        <Stack>
            {
                selector.canCarEnter === 0 ? (
                    <Stack spacing={4} className={styles.addLot}>
                        <TextField
                            placeholder="enter number of parking spaces"
                            value={totalLot}
                            onChange={addSpaces}
                            type={"number"}
                            size='small'
                        />
                        <Button variant='contained' onClick={addLots} disabled={!totalLot}>
                            Add parking lots
                        </Button>
                    </Stack>
                )
                    : (
                        <Stack className={styles.addLot} style={{ height: '100%' }}>
                            <Stack mt={5} spacing={2}>
                                <TextField
                                    placeholder='enter car registration number'
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    size="small"
                                />
                                <Button variant='contained' onClick={allotALot} disabled={!registrationNumber} >
                                    Allot a random lot
                                </Button>
                            </Stack>

                            {
                                selector.canCarEnter === 1 &&
                                <Typography variant='h4' mt={4}>No more spaces available for parking</Typography>
                            }

                            <Typography variant='h2' mt={4}>All parking lots</Typography>
                            <ImageList cols={4} sx={{ width: '80%', height: '70%', mx: "auto" }} >
                                {
                                    selector.lot_status.map(lots => (
                                        <ImageListItem key={lots} sx={{ margin: 'auto', cursor: 'pointer' }} onClick={() => showLotDetails(lots)}>
                                            <img src='/parking-lot.jpg' style={{ height: "50%", position: 'relative' }} />
                                            <Typography variant='h5' data-testid="lotNumber" className={styles.lotNumber} >{lots.split(" ", 1)}</Typography>
                                            <h1 onClick={() => showLotDetails(lots)} data-testid="lot" >{lots}</h1>
                                        </ImageListItem>
                                    ))
                                }
                            </ImageList>
                        </Stack>
                    )
            }
        </Stack>
    )
}
