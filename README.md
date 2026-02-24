# TrustShield AI: Confidence & Evidence Layer

TrustShield AI is a model-agnostic governance infrastructure layer that sit between foundation models and enterprise applications. It extracts factual claims from AI responses, identifies evidence, cross-checks across multiple models, and produces a calibrated risk score.

## Features

- **Model-Agnostic Governance**: Not tied to any one foundation model.
- **Cross-Model Divergence Scoring**: Measures epistemic uncertainty through disagreement between models.
- **Claim-Level Risk Decomposition**: Provides detailed scoring for every individual claim made.
- **Regulatory Audit Trace**: Machine-readable compliance logs ready for the EU AI Act.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Logic**: AI SDK (Google, OpenAI, Anthropic)
- **Styling**: Vanilla CSS with Modern Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file with your API keys:
   ```env
   OPENAI_API_KEY=your_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Dashboard**:
   Open [http://localhost:3000](http://localhost:3000)

## Mathematical Framework

Risk Score $R = f(F, E, S, M, U)$
- $F$: Factual claim validity
- $E$: Evidence sufficiency
- $S$: Speculative language density
- $M$: Cross-model agreement variance
- $U$: Uncertainty calibration mismatch

## Use Cases

- **Legal**: Verifying drafted opinions and regulatory references.
- **Fintech**: Checking credit risk models and compliance disclosures.
- **Healthcare**: Assessing AI-driven diagnostic suggestions.
