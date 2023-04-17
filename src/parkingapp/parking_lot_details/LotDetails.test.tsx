import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import LotDetail from "."
import { addLotDetails, addParkingLots, updateLotStatus } from "../store/parkings"
import store from "../store/store"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({
        number: '1',
    }),
    useRouteMatch: () => ({ url: '/parkinglot/1' }),
}));

describe("details component", () => {
    test("render component", () => {
        render(
            <Provider store={store} >
                <BrowserRouter>
                    <LotDetail />
                </BrowserRouter>
            </Provider >
        )
    });

    test("Component testing", async () => {
        render(
            <Provider store={store} >
                <BrowserRouter>
                    <LotDetail />
                </BrowserRouter>
            </Provider>
        )

        expect(screen.getByText('This parking lot is now avialable'))

        let backBtn = screen.getByRole("button", { name: /go back/i })
        expect(backBtn).toBeInTheDocument()
        fireEvent.click(backBtn)

    });

    test("Component testing", async () => {
        window.history.pushState({}, "", "/parkinglot/1")

        store.dispatch(addParkingLots(1))
        store.dispatch(updateLotStatus(0))
        store.dispatch(addLotDetails({ index: 0, reg: "test" }))

        render(
            <Provider store={store} >
                <BrowserRouter>
                    <Routes>
                        <Route path="parkinglot/:number" element={<LotDetail />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        )

        expect(screen.getByText('Registration Number : test')).toBeInTheDocument()
        expect(screen.getByTestId('entry_time')).toBeInTheDocument()


        let paymentBtn = screen.getByRole("button", { name: /make payment/i })
        expect(paymentBtn).toBeInTheDocument()
        fireEvent.click(paymentBtn)

    })
})