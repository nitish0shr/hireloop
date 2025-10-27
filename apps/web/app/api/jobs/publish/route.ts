export async function POST(req: Request) {
  const body = await req.json();
  return new Response(
    JSON.stringify({
      id: body?.jobId ?? 'job_1',
      publicUrl: `https://example.com/job/${body?.jobId ?? 'job_1'}`,
      externalId: 'ext_1'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
