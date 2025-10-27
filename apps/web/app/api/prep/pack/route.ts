export async function POST(request: Request) {
  const { candId } = await request.json();
  return new Response(
    JSON.stringify({ pdfUrl: `https://example.com/prep/${candId}.pdf` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
