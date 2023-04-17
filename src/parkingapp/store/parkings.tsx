import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ParkingDetails {
    reigstration_number: string;
    entry_time: Date
}

export interface parkingState {
    total_parking_lot: number;
    lot_status: Array<string>;
    lot_details: ParkingDetails[];
    canCarEnter: 0 | 1 | 2;
    err: string;
}

export const lotStatus = {
    available: `This lot is available`,
    booked: `This lot is booked`
}

const initialState: parkingState = {
    total_parking_lot: 0,
    lot_status: [],
    lot_details: [],
    canCarEnter: 0,
    err: ""
}

const data = {
    "car-registration": "TU 8 0BB",
    "charge": 20
}

export const getpaymentDetail = createAsyncThunk("parkingSlice/getpaymentDetail", (parkingLot: number) => {
    return axios.post(`http://httpstat.us/200`, { data }).then(res => {
        return parkingLot
    })
})

const parkingSlice = createSlice({
    name: "parkingSlice",
    initialState,
    reducers: {
        addParkingLots: (state, action) => {
            state.total_parking_lot = action.payload;
            state.lot_status = Array.from({ length: state.total_parking_lot }).map((_, i) => `${i + 1} ${lotStatus.available}`)
        },
        updateLotStatus: (state, action) => {
            state.lot_status[action.payload] = `${state.lot_status[action.payload]?.split(" ", 1)} ${lotStatus.booked}`;
        },
        addLotDetails: (state, action) => {
            // const entry = new Date();
            state.lot_details[action.payload.index] = {
                reigstration_number: action.payload.reg,
                entry_time: new Date("2023-01-30T17:43:10.643Z")
            }
        },
        canCarEnter: (state, action) => {
            state.canCarEnter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getpaymentDetail.fulfilled, (state, action: PayloadAction<number>) => {
            state.err = "";
            state.lot_status[action.payload] = `${action.payload + 1} ${lotStatus.available}`;
        })
        builder.addCase(getpaymentDetail.rejected, (state, action) => {
            action.error.message = action.error.message
        })
    }
})

export default parkingSlice.reducer;
export const { addParkingLots, updateLotStatus, addLotDetails, canCarEnter } = parkingSlice.actions
