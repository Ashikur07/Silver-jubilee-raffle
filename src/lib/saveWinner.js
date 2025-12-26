import Ticket from "@/models/Ticket";

export async function saveWinner(ticketNumber, prizeIndex) {
  await Ticket.updateOne(
    { number: ticketNumber },
    {
      $set: {
        isWinner: true,
        prizeIndex,
        wonAt: new Date(),
      },
    }
  );
}
