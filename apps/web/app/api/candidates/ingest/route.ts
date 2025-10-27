export async function POST(request: Request) {
  const body = await request.json();
  const { jobId, fileUrl, emailParse, profile } = body;
  return new Response(
    JSON.stringify({
      id: 'cand_1',
      jobId: jobId || 'job_1',
      status: 'ingested'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
