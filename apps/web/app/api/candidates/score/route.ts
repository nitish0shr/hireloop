export async function POST(request: Request) {
  const body = await request.json();
  const { candId } = body;
  return new Response(
    JSON.stringify({
      candId: candId || 'cand_1',
      fitScore: 85,
      coverage: 0.9,
      flags: [],
      notes: 'This is a mock score'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
