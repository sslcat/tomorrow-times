import { NextResponse } from 'next/server';
export async function POST() {return NextResponse.json({error:'Reader posting is disabled. Verified public authentication and moderation must be connected before launch.'},{status:403});}
