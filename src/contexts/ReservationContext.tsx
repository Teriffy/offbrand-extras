"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ReservationContextType {
  reservationCode: string | null;
  guestName: string | null;
  isLoaded: boolean;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

export function ReservationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reservationCode, setReservationCode] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Extract from URL params on client mount
    const params = new URLSearchParams(window.location.search);
    const res = params.get("res");
    const name = params.get("name");

    setReservationCode(res);
    setGuestName(name);
    setIsLoaded(true);
  }, []);

  return (
    <ReservationContext.Provider
      value={{
        reservationCode,
        guestName,
        isLoaded,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within ReservationProvider");
  }
  return context;
}
