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
              status: appointment.status || "confirmed",
              createdAt: new Date().toISOString(),
            },
            ...state.appointments,
          ],
        })),

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status } : apt
          ),
        })),

      updateAppointmentNotes: (id, notes) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, clinicalNotes: notes } : apt
          ),
        })),

      seedDemoAppointments: (demoList) =>
        set((state) => {
          const existingIds = new Set(state.appointments.map((a) => a.id));
          const toAdd = demoList.filter((d) => !existingIds.has(d.id));
          return { appointments: [...toAdd, ...state.appointments] };
        }),

      clearAppointments: () => set({ appointments: [] }),
    }),
    { name: "campuscare-appointments" }
  )
);
