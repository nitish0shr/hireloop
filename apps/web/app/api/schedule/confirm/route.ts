export async function POST(request: Request) {
  const body = await request.json();
  const { candId, slotId } = body;
  return new Response(
    JSON.stringify({
      eventId: `event_${candId}_${slotId}`,
      meetingLink: `https://example.com/meet/${candId}_${slotId}`,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
