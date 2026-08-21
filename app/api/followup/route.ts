import { NextRequest, NextResponse } from 'next/server';
import { callGroq, groq } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Accept both new prompt format and UI diagnosis wrapper object
    const topic = body.topic || 'fractions';
    const misconceptionId = body.misconceptionId || body.diagnosis?.misconceptionId || 'denominator_ignored';
    const misconceptionDescription = body.misconceptionDescription || body.diagnosis?.underlyingMentalModel || body.diagnosis?.rootCauseAnalysis || 'Added or subtracted numerators and denominators separately';

    const systemPrompt = `You are a math and science question generator. A student showed this misconception: ${misconceptionId} - ${misconceptionDescription}.
Generate ONE new multiple-choice question on the same topic that tests whether they still hold this misconception.

CRITICAL CONSTRAINTS:
1. Do NOT reference, name, or describe the misconception or flawed method in the question text itself.
2. Present a natural, clean textbook question using different numbers/variables than the original question.
3. MATHEMATICAL PRECISION: Before finalizing, verify each distractor option is the ACTUAL mathematical result of applying the specific misconception described, not just a plausible-looking wrong answer. Show your work internally: compute what answer a student WOULD get if they applied exactly this flawed method to this exact question, and ensure that computed value is one of the 4 options. Do not include distractors representing a different misconception than the one specified.
4. SHOW UNREDUCED FORM: When a distractor is a fraction produced by the flawed computation (e.g. 8/24), write it in its raw UNREDUCED form (e.g. "8/24", not "1/3"). This makes the specific computational error visible. Only the correct answer should appear in fully simplified form.

Respond ONLY with a valid JSON object matching this exact structure:
{
  "question": "Clear textbook question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswerIndex": 0,
  "whyThisTargetsIt": "One sentence explaining how the distractor options test if the student still makes the error."
}`;

    const userPrompt = `Topic: ${topic}. Misconception ID: ${misconceptionId}. Description: ${misconceptionDescription}.`;

    if (groq) {
      const result = await callGroq<{
        question: string;
        options: string[];
        correctAnswerIndex: number;
        whyThisTargetsIt: string;
      }>(systemPrompt, userPrompt);

      return NextResponse.json({
        question: result.question,
        options: result.options,
        correctAnswerIndex: result.correctAnswerIndex,
        whyThisTargetsIt: result.whyThisTargetsIt,

        // UI compatibility properties
        targetMisconception: misconceptionId,
        conceptualBridge: result.whyThisTargetsIt,
        explanation: result.whyThisTargetsIt,
        hint: 'Consider how the operation acts on the whole unit.'
      });
    }

    // Fallback when GROQ_API_KEY is unconfigured locally
    const fallbackFollowup = {
      question: 'Calculate the sum: 3/8 + 5/12',
      options: [
        '8/24',
        '19/24',
        '8/20',
        '15/24'
      ],
      correctAnswerIndex: 1,
      whyThisTargetsIt: 'The option 8/24 specifically targets common_denom_confusion where a student finds common denominator 24 but forgets to scale the numerators (3+5=8).',

      // UI compatibility properties
      targetMisconception: misconceptionId,
      conceptualBridge: 'The option 8/24 specifically targets common_denom_confusion where a student finds common denominator 24 but forgets to scale the numerators (3+5=8).',
      explanation: 'The option 8/24 specifically targets common_denom_confusion where a student finds common denominator 24 but forgets to scale the numerators (3+5=8).',
      hint: 'Remember to scale the numerators when converting to an equivalent denominator.'
    };

    return NextResponse.json(fallbackFollowup);
  } catch (error: unknown) {
    console.error('Error in /api/followup:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to generate targeted follow-up question';
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
