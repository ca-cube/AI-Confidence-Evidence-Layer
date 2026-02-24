import { NextRequest, NextResponse } from 'next/server';
import { RiskEngine } from '@/lib/risk-engine';

export async function POST(req: NextRequest) {
    try {
        const { output, domain, context } = await req.json();

        if (!output || !domain) {
            return NextResponse.json({ error: 'Missing output or domain' }, { status: 400 });
        }

        const engine = new RiskEngine();
        const result = await engine.verify(output, domain, context);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Risk Scoring Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}
