export async function POST(request: Request) {
  const body = await request.json();
  const { candId, templateId, step } = body;
  return new Response(
    JSON.stringify({
      messageId: `msg-${candId}-${step ?? ''}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
