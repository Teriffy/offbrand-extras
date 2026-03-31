"use client";

import { useReservation } from "@/contexts/ReservationContext";

export function ReservationBanner() {
  const { reservationCode, guestName, isLoaded } = useReservation();

  if (!isLoaded) return null;

  if (!reservationCode || !guestName) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <p className="text-amber-700">
          ⚠️ Please use the link from your email to access the guest services shop.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <p className="text-blue-700">
        Ordering for reservation <span className="font-semibold">{reservationCode}</span> / {guestName}
      </p>
    </div>
  );
}
