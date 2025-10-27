import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { jdText } = await req.json();
  const job = {
    id: 'job_1',
    title: jdText || 'New Job',
    publicUrl: `/jobs/job_1`,
    externalId: 'ext_1'
  };
  return NextResponse.json(job);
}
