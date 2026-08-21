import { NextRequest, NextResponse } from 'next/server';
import { callGroq, groq } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, question, correctAnswer } = body;

    if (!topic || !question) {
      return NextResponse.json(
        { error: 'Missing required parameters: topic and question' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an educational AI expert. Given a topic, question, and correct answer, generate 3 to 4 plausible student misconception types that could explain common wrong answers for this question.
Respond ONLY with a valid JSON object matching this exact structure:
{
  "taxonomy": {
    "misconception_1_key": "One sentence description of the error pattern",
    "misconception_2_key": "One sentence description of the error pattern",
    "misconception_3_key": "One sentence description of the error pattern"
  }
}`;

    const userPrompt = `Topic: ${topic}\nQuestion: "${question}"\nCorrect Answer: "${correctAnswer || 'N/A'}"`;

    if (groq) {
      const result = await callGroq<{
        taxonomy: Record<string, string>;
      }>(systemPrompt, userPrompt);

      return NextResponse.json({
        topic,
        taxonomy: result.taxonomy || {
          concept_overgeneralization: 'Applied a rule from a different context without verifying domain boundaries.',
          surface_pattern_matching: 'Mapped visual or surface keywords directly to an incorrect formula.',
          procedural_inversion: 'Inverted the order of mathematical or logical operations.'
        }
      });
    }

    // Fallback when GROQ_API_KEY is unconfigured
    return NextResponse.json({
      topic,
      taxonomy: {
        concept_overgeneralization: 'Applied a rule from a different context without verifying domain boundaries.',
        surface_pattern_matching: 'Mapped visual or surface keywords directly to an incorrect formula.',
        procedural_inversion: 'Inverted the order of mathematical or logical operations.'
      }
    });
  } catch (error: unknown) {
    console.error('Error in /api/infer-taxonomy:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to infer misconception taxonomy';
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
