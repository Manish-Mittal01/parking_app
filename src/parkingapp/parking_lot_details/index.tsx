import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../Home'
import { useParams, useNavigate } from 'react-router-dom'
import { getpaymentDetail } from '../store/parkings';
import store from '../store/store';
import styles from './LotDetails.module.css'
import { Stack, Button, Typography } from '@mui/material';

export default function LotDetail() {
    const state = useSelector((state: State) => state.getData);
    let params = useParams()
    let lotNumber: number = Number(params.number) - 1;
    // let lotNumber = 0;
    const navigate = useNavigate();
    type dispatchType = typeof store.dispatch
    const dispatch = useDispatch<dispatchType>()

    const goBack = () => {
        navigate("/");
    }

    const paymentMade = async () => {
        const calculateParkingFees = () => {
            let exit_time: any = new Date();
            let entry_time: any = state.lot_details[lotNumber].entry_time;
            const totalMSParked = exit_time - entry_time;
            const totalHoursParked = totalMSParked / (1000 * 3600);
            return `Your parking fee is £${getCost(totalHoursParked)}.`;
        }

        const getCost = (totalHoursParked: number) => {
            const costs = [20, 10];
            if (totalHoursParked <= 2) {
                return Math.ceil(totalHoursParked) * costs[0]
            }
            else {
                return Math.ceil(totalHoursParked) * costs[1]
            }
        };
        alert(calculateParkingFees());

        console.log(window.location.href)
        // await dispatch(getpaymentDetail(lotNumber))
        // navigate("/")
    }

    return (
        <Stack>
            {
                state.lot_details[lotNumber] ?
                    <Stack className={styles.vehicalDetails}>
                        <Typography variant='h4' my={3} data-testid="registration_number">
                            Registration Number : {state.lot_details[lotNumber].reigstration_number}
                        </Typography>
                        <Typography variant='h4' mb={3} data-testid="entry_time">
                            Entry : {state.lot_details[lotNumber].entry_time.toLocaleString()}
                        </Typography>
                    </Stack>
                    : <p>This parking lot is now avialable</p>
            }
            <Stack direction={"row"} spacing={2} className={styles.endBtns} mb={3}>
                <Button variant='contained' onClick={goBack}>go back</Button>
                <Button variant='contained' onClick={paymentMade}>make payment</Button>
            </Stack>
        </Stack>
    )
}
