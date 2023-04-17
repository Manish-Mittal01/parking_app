import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider, useDispatch, useSelector } from "react-redux"
import { BrowserRouter, createMemoryRouter, Router } from "react-router-dom"
import Home, { State } from "."
import { addLotDetails, lotStatus } from "../store/parkings"
import store from "../store/store"


describe("home compoent", () => {
    test("render Home component", () => {
        render(
            <Provider store={store} >
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider >
        )
    })

    test("parking lots added", async () => {
        render(
            <Provider store={store} >
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider >
        )
        let total_spaces = screen.getByPlaceholderText("enter number of parking spaces")
        expect(total_spaces).toBeInTheDocument();
        fireEvent.change(total_spaces, { target: { value: "10" } })

        let b1 = screen.getByRole("button", { name: "Add parking lots" })
        expect(b1).toBeInTheDocument();
        await waitFor(() => expect(b1).not.toBeDisabled())

        fireEvent.click(b1)
        expect(b1).not.toBeInTheDocument()

        let registration_filed = screen.getByPlaceholderText("enter car registration number")
        fireEvent.change(registration_filed, { target: { value: "test" } })

        let b2 = screen.getByRole("button", { name: "Allot a random lot" })
        expect(b2).toBeInTheDocument();
        fireEvent.click(b2)

        expect(screen.getByRole("heading", { level: 2, name: "All parking lots" })).toBeInTheDocument();
        expect(screen.getAllByTestId('lotNumber')[0]).toBeInTheDocument();

        let lot = screen.getAllByTestId("lot")
        for (let i = 1; i <= lot.length; i++) {
            if (lot[i]?.textContent?.includes("This lot is booked")) {
                fireEvent.click(lot[i])
            }
        }

    })

})