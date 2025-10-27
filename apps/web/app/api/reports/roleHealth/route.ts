export async function POST(request: Request) {
  const body = await request.json();
  const { jobId } = body;
  return new Response(
    JSON.stringify({
      metrics: {
        qualifiedOnHand: 5,
        replyRate: 0.8,
        interviews7d: 3,
        newApps24h: 2,
        healthIndex: 0.9,
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
