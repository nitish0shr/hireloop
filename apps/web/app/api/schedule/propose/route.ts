export async function POST(request: Request) {
  const body = await request.json();
  const { candId, recruiterId } = body;
  return new Response(
    JSON.stringify({
      slots: [
        { id: 'slot1', start: '2025-01-01T09:00:00Z', end: '2025-01-01T09:30:00Z' },
        { id: 'slot2', start: '2025-01-02T10:00:00Z', end: '2025-01-02T10:30:00Z' },
        { id: 'slot3', start: '2025-01-03T11:00:00Z', end: '2025-01-03T11:30:00Z' },
      ],
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
