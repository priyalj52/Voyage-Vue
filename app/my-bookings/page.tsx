
import { getBookingsByOwnerId } from "@/actions/getBookingByOwnerId";
import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingUI from "@/components/booking/MyBookingsUI";

const MyBookings = async () => {
  const bookingsFromVisitors = await getBookingsByUserId();
  const bookingsFromOwner = await getBookingsByOwnerId(); //myself

  if (!bookingsFromOwner && !bookingsFromVisitors)
    return <div>No Bookings found</div>;

  return (
    <div className="flex flex-col gap-10">
      {!!bookingsFromOwner?.length && (
        <div className="">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are the bookings you have made !
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
            {bookingsFromOwner?.map(booking =><MyBookingUI   key={booking.id} booking={booking} />
            )}
          </div>
        </div>
      )}

{!!bookingsFromVisitors?.length && (
        <div className="">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are the bookings visitors have Made !
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
            {bookingsFromVisitors?.map(booking =><MyBookingUI   key={booking.id} booking={booking} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
