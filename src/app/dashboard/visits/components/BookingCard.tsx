import { Booking } from "@/types/booking";  // ✅ import typu Booking

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <p className="text-sm text-gray-500">
        {new Date(booking.date).toLocaleString()}
      </p>
      <p className="text-lg font-semibold">{booking.property_name}</p>
      <p
        className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
          booking.status === "accepted"
            ? "bg-green-100 text-green-700"
            : booking.status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {booking.status === "pending"
          ? "Oczekuje"
          : booking.status === "accepted"
          ? "Zatwierdzona"
          : "Odrzucona"}
      </p>
    </div>
  );
}

