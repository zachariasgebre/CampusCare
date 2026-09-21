import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppointmentsStore = create(
  persist(
    (set) => ({
      appointments: [],

      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            {
              ...appointment,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            },
            ...state.appointments,
          ],
        })),

      clearAppointments: () => set({ appointments: [] }),
    }),
    { name: "campuscare-appointments" }
  )
);
