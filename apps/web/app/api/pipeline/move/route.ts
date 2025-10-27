export async function POST(request: Request) {
  const body = await request.json();
  const { candId, toStage } = body;
  return new Response(
    JSON.stringify({
      candId,
      toStage,
      activityId: `activity-${candId}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
