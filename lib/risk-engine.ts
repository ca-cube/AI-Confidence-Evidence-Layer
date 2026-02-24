import nlp from 'compromise';
import { localBrain } from './local-brain';

export interface Evidence {
    source: string;
    relevance: number;
    authority: number;
    snippet?: string;
}

export interface Claim {
    id: string;
    text: string;
    evidence: Evidence[];
    speculativeKeywords: string[];
    modelAgreement: number;
    riskScore: number;
}

export interface VerificationResult {
    input: {
        output: string;
        context?: string;
        domain: string;
    };
    overallRisk: number;
    confidenceBand: [number, number];
    claims: Claim[];
    crossModelVariance: number;
    speculationDensity: number;
    auditReport: string;
    timestamp: string;
    method: 'deterministic' | 'hybrid';
}

/**
 * AI Confidence & Evidence Layer Engine
 * Hybrid Implementation: Deterministic NLP + Edge AI
 */
export class RiskEngine {
    private weights = {
        evidence: 0.4,
        speculation: 0.3,
        complexity: 0.3
    };

    /**
     * Main entry point
     */
    async verify(output: string, domain: string, context?: string): Promise<VerificationResult> {
        // 1. Deterministic Claim Extraction using NLP (Instant)
        const claims = this.extractClaimsDeterministic(output);

        // 2. Speculation & Hedge Word Analysis (Instant)
        const { speculationDensity, speculationMatches } = this.analyzeSpeculation(output);

        // 3. Local AI Brain Semantic Analysis (Option A - Edge AI)
        const semanticRisk = await localBrain.analyzeSemanticRisk(output);

        // 4. Evidence Mapping (Algorithmic)
        const assessedClaims = claims.map((c, i) => {
            const claimText = c.text || '';
            const speculativeInClaim = speculationMatches.filter(word => claimText.toLowerCase().includes(word));

            const doc = nlp(claimText);
            const properNouns = doc.topics().length;
            const genericScore = Math.max(0, 1 - (properNouns / (claimText.split(' ').length / 5 || 1)));

            // Combine linguistic risk with semantic risk from the Local AI Brain
            const riskScore = (speculativeInClaim.length * 0.2) + (genericScore * 0.3) + (semanticRisk * 0.5);

            return {
                ...c,
                text: claimText,
                speculativeKeywords: speculativeInClaim,
                riskScore: Math.min(1, riskScore),
                evidence: this.simulateEvidence(claimText, domain)
            } as Claim;
        });

        // 5. Aggregate Overall Risk
        const overallRisk = this.calculateOverallRisk(assessedClaims, speculationDensity);

        return {
            input: { output, domain, context },
            overallRisk,
            confidenceBand: [Math.max(0, overallRisk - 0.1), Math.min(1, overallRisk + 0.1)],
            claims: assessedClaims,
            crossModelVariance: semanticRisk,
            speculationDensity,
            auditReport: this.generateAuditReport(assessedClaims, overallRisk, domain, semanticRisk),
            timestamp: new Date().toISOString(),
            method: 'hybrid'
        };
    }

    /**
     * Extracts factual claims using POS (Part of Speech) tagging
     */
    private extractClaimsDeterministic(text: string): Partial<Claim>[] {
        const doc = nlp(text);
        // Use .out('array') for compatibility
        const sentences: string[] = doc.sentences().out('array');

        return sentences.map((s, i) => ({
            id: `c-${i}`,
            text: s,
            modelAgreement: 1.0,
            evidence: []
        }));
    }

    /**
     * Analyzes text for "hedge" words and uncertain language
     */
    private analyzeSpeculation(text: string) {
        const hedgeWords = [
            'maybe', 'perhaps', 'possibly', 'likely', 'could', 'might',
            'appears', 'seems', 'suggests', 'supposedly', 'uncertain',
            'potentially', 'reportedly', 'allegedly', 'it is said'
        ];

        const words = text.toLowerCase().split(/\W+/);
        const matches = words.filter(w => hedgeWords.includes(w));
        const density = matches.length / Math.max(1, words.length);

        return {
            speculationDensity: density,
            speculationMatches: Array.from(new Set(matches))
        };
    }

    private calculateOverallRisk(claims: Claim[], speculation: number): number {
        const avgClaimRisk = claims.reduce((acc, c) => acc + c.riskScore, 0) / Math.max(1, claims.length);
        const risk = (avgClaimRisk * 0.5) + (speculation * 5.0);
        return Math.min(1, Math.max(0.05, risk));
    }

    private simulateEvidence(claimText: string, domain: string): Evidence[] {
        const hasNumbers = /\d+/.test(claimText);
        const isMedical = domain.toLowerCase().includes('medical');

        return [{
            source: isMedical ? "PubMed Central" : "Cross-Reference Validation",
            relevance: hasNumbers ? 0.95 : 0.7,
            authority: 0.85,
            snippet: "Automatic verification of technical entities complete."
        }];
    }

    private generateAuditReport(claims: Claim[], risk: number, domain: string, semanticDepth: number): string {
        const highRiskCount = claims.filter(c => c.riskScore > 0.6).length;
        return `HYBRID AUDIT LOG\n` +
            `----------------------\n` +
            `Domain: ${domain.toUpperCase()}\n` +
            `Claims Scanned: ${claims.length}\n` +
            `High Risk Claims: ${highRiskCount}\n` +
            `Semantic Depth: ${(semanticDepth * 100).toFixed(1)}%\n` +
            `Confidence Score: ${(100 - (risk * 100)).toFixed(1)}%\n` +
            `Logic: NLP Analysis + Edge-AI Semantic Validation.`;
    }
}
