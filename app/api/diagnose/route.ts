import { NextRequest, NextResponse } from 'next/server';
import { callGroq, groq } from '@/lib/groq';
import { TAXONOMY } from '@/lib/taxonomy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Support both new prompt API payload format and existing UI format for backward compatibility
    const topic = body.topic || 'fractions';
    const question = body.question;
    const correctAnswer = body.correctAnswer || body.correctAnswerText || '';
    const wrongAnswer = body.wrongAnswer || body.selectedOptionText || '';
    const taxonomy = body.taxonomy || TAXONOMY[topic as keyof typeof TAXONOMY] || TAXONOMY.fractions;

    if (!question || !wrongAnswer) {
      return NextResponse.json(
        { error: 'Missing required parameters: question and wrongAnswer (or selectedOptionText)' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a misconception classifier and cognitive diagnostic expert for ${topic}. Given a question, the correct answer, and a student's wrong answer, classify which misconception from this fixed list best explains the error: ${JSON.stringify(taxonomy)}.

CRITICAL REQUIREMENT: You MUST provide 4 DISTINCT, non-overlapping pieces of diagnostic reasoning in plain language:
1. flawedMentalModel: What the student likely believes that's wrong (the misconception itself in plain language).
2. distractorAnalysis: Specifically why THIS wrong answer choice was attractive/tempting given that flawed belief.
3. rootCause: The deeper conceptual gap this points to (the "why" behind the why, e.g. lack of unit scaling, structural notation misunderstanding, or physical law misapplication).
4. remedyStrategy: A concrete, actionable one-sentence suggestion for how a teacher or learner can address this gap (e.g. "Use visual area models to demonstrate combining fraction parts" or "Substitute x=2 to demonstrate why (x+3)^2 is not x^2+9").

Respond ONLY with a valid JSON object matching this exact structure:
{
  "misconceptionId": "exact_key_from_taxonomy",
  "confidence": 0.95,
  "flawedMentalModel": "Clear one-sentence description of the flawed rule or belief.",
  "distractorAnalysis": "Clear explanation of why this specific distractor option appealed to that flawed belief.",
  "rootCause": "Deep conceptual root cause explaining the underlying knowledge gap.",
  "remedyStrategy": "Concrete, actionable pedagogical recommendation for fixing the gap."
}`;

    const userPrompt = `Question: "${question}"\nCorrect Answer: "${correctAnswer}"\nStudent Wrong Answer: "${wrongAnswer}"${body.studentReasoning ? `\nStudent Work: "${body.studentReasoning}"` : ''}`;

    if (groq) {
      const result = await callGroq<{
        misconceptionId: string;
        confidence: number;
        flawedMentalModel: string;
        distractorAnalysis: string;
        rootCause: string;
        remedyStrategy: string;
      }>(systemPrompt, userPrompt);

      return NextResponse.json({
        misconceptionId: result.misconceptionId,
        confidence: result.confidence,
        flawedMentalModel: result.flawedMentalModel,
        distractorAnalysis: result.distractorAnalysis,
        rootCause: result.rootCause,
        remedyStrategy: result.remedyStrategy,

        // Backward compatibility fields for UI components
        misconceptionName: result.misconceptionId,
        category: 'Cognitive Misconception Flaw',
        confidenceScore: result.confidence,
        underlyingMentalModel: result.flawedMentalModel,
        whyChosenDistractorPicked: result.distractorAnalysis,
        rootCauseAnalysis: result.rootCause,
        comparativeInsight: {
          traditionalResponse: 'Lower difficulty by 1 level.',
          misfireResponse: `Target misconception ${result.misconceptionId}: ${result.remedyStrategy}`
        }
      });
    }

    // Fallback when GROQ_API_KEY is unconfigured locally
    const knownId = body.knownMisconceptionId || 'denominator_ignored';
    const fallbackFlawedModel = 'The student believes numerators and denominators are separate independent whole numbers that can be added directly.';
    const fallbackDistractorAnalysis = `The option "${wrongAnswer}" directly results from adding top numbers and bottom numbers independently.`;
    const fallbackRootCause = 'Lack of fractional unit scale understanding — failing to realize that fractions represent ratios of a unified whole unit.';
    const fallbackRemedy = 'Use visual fraction tile diagrams or pizza slice area models to demonstrate why unit size must match before combining parts.';
    
    return NextResponse.json({
      misconceptionId: knownId,
      confidence: 0.95,
      flawedMentalModel: fallbackFlawedModel,
      distractorAnalysis: fallbackDistractorAnalysis,
      rootCause: fallbackRootCause,
      remedyStrategy: fallbackRemedy,

      // Backward compatibility fields
      misconceptionName: knownId,
      category: 'Tagged Taxonomy Gap',
      confidenceScore: 0.95,
      underlyingMentalModel: fallbackFlawedModel,
      whyChosenDistractorPicked: fallbackDistractorAnalysis,
      rootCauseAnalysis: fallbackRootCause,
      comparativeInsight: {
        traditionalResponse: 'Lower difficulty by 1 level.',
        misfireResponse: `Target misconception ${knownId}: ${fallbackRemedy}`
      }
    });
  } catch (error: unknown) {
    console.error('Error in /api/diagnose:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to perform misconception diagnosis';
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
