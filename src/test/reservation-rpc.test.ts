import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: rpcMock }),
}));

import {
  createReservation,
  deleteReservation,
  updateReservationDetails,
  updateReservationStatus,
} from "@/lib/supabase";

describe("Reservation RPC helpers", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ data: "reservation-id", error: null });
  });

  it("creates a public reservation through the restricted RPC and preserves buffet CRM source", async () => {
    const reservation = {
      name: "Awa Ndiaye",
      phone: "+221 77 520 14 88",
      email: "awa@example.com",
      date: "2026-11-12",
      time: "12:30",
      guests: 4,
      occasion: "Brunch",
      message: "Chaise bébé",
    };

    await expect(createReservation(reservation, "buffet")).resolves.toBe("reservation-id");
    expect(rpcMock).toHaveBeenCalledWith("create_reservation", {
      p_name: reservation.name,
      p_phone: reservation.phone,
      p_email: reservation.email,
      p_date: reservation.date,
      p_time: reservation.time,
      p_guests: reservation.guests,
      p_occasion: reservation.occasion,
      p_message: reservation.message,
      p_customer_source: "buffet",
    });
  });

  it("uses separate admin RPCs for status, detail updates and deletion", async () => {
    await updateReservationStatus("reservation-id", "confirmed");
    await updateReservationDetails("reservation-id", { name: "Awa Ndiaye", guests: 5 });
    await deleteReservation("reservation-id");

    expect(rpcMock.mock.calls).toEqual([
      ["update_reservation_status", { p_reservation_id: "reservation-id", p_status: "confirmed" }],
      [
        "update_reservation_details",
        { p_reservation_id: "reservation-id", p_details: { name: "Awa Ndiaye", guests: 5 } },
      ],
      ["delete_reservation", { p_reservation_id: "reservation-id" }],
    ]);
  });

  it("surfaces database validation errors instead of reporting success", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: "Téléphone invalide" } });

    await expect(
      createReservation({
        name: "Awa Ndiaye",
        phone: "incorrect",
        email: "awa@example.com",
        date: "2026-11-12",
        time: "12:30",
        guests: 2,
      }),
    ).rejects.toThrow("Téléphone invalide");
  });
});
