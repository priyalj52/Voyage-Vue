import { Room } from "@prisma/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
interface BookRoomStore {
    bookingRoomData: RoomData | null,
    paymentIntent: string | null,
    clientSecret: string | undefined,
    setRoomData:(data:RoomData)=>void,
    setPaymentIntent: (paymentIntent: string) =>void,
    setClientSecret: (clientSecret: string) =>void,
    resetBookRoom: () => void

}

type RoomData = {
    room: Room,
    totalPrice: number,
    breakfastIncluded: boolean,
    startDate: Date,
    endDate: Date
}

const useBookRoom = create<BookRoomStore>()(
    persist((set) => (

        {
            bookingRoomData: null,
            paymentIntent: null,
            clientSecret: undefined,
            setRoomData: (data: RoomData) => {
                set({ bookingRoomData: data })
            },
                setPaymentIntent: (paymentIntent: string) => {
                set({ paymentIntent })
            },
            setClientSecret: (clientSecret: string) => {
                set({ clientSecret })
            },
            resetBookRoom: () => {
                set({
                    bookingRoomData: null,
                    clientSecret: undefined,
                    paymentIntent: null
                })
            }


        }
    ), {
        name: 'BookRoom'
    })

)
export default useBookRoom