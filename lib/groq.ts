import { Groq } from 'groq-sdk';
import { getMisconceptionById, Misconception } from './taxonomy';

const apiKey = process.env.GROQ_API_KEY;
export const groq = apiKey && apiKey !== 'your_key_here' ? new Groq({ apiKey }) : null;

export const DEFAULT_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

/**
 * Call Groq with systemPrompt and userPrompt, returning parsed JSON.
 * Retries once on malformed JSON response.
 */
export async function callGroq<T = unknown>(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL
): Promise<T> {
  if (!groq) {
    throw new Error('GROQ_API_KEY is not set or invalid in environment variables.');
  }

  let attempts = 0;
  let lastError: unknown = null;

  while (attempts < 2) {
    attempts++;
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model,
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const rawContent = completion.choices[0]?.message?.content || '';
      if (!rawContent) {
        throw new Error('Empty response received from Groq API');
      }

      // Clean potential code block markers
      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed as T;
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`callGroq attempt ${attempts} failed:`, errMsg);
    }
  }

  const finalErrMsg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Failed to receive valid JSON from Groq API after 2 attempts. Last error: ${finalErrMsg}`);
}

export interface DiagnosisResult {
  misconceptionId: string;
  misconceptionName: string;
  category: string;
  confidenceScore: number;
  flawedMentalModel?: string;
  distractorAnalysis?: string;
  rootCause?: string;
  underlyingMentalModel: string;
  rootCauseAnalysis: string;
  whyChosenDistractorPicked: string;
  remedyStrategy: string;
  comparativeInsight: {
    traditionalResponse: string;
    misfireResponse: string;
  };
}

export interface FollowupQuestionResult {
  question: string;
  targetMisconception: string;
  conceptualBridge: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  explanation: string;
  hint: string;
}

/**
 * High-level helper for UI compatibility
 */
export async function diagnoseStudentAnswer(params: {
  question: string;
  selectedOptionText: string;
  isCorrect: boolean;
  correctAnswerText: string;
  studentReasoning?: string;
  knownMisconceptionId?: string;
}): Promise<DiagnosisResult> {
  const { question, selectedOptionText, isCorrect, correctAnswerText, studentReasoning, knownMisconceptionId } = params;

  if (isCorrect) {
    return {
      misconceptionId: 'NONE',
      misconceptionName: 'No Misconception Detected',
      category: 'Correct Concept',
      confidenceScore: 0.98,
      flawedMentalModel: 'Correct understanding of the target concept.',
      distractorAnalysis: 'N/A - Correct option was selected.',
      rootCause: 'The student successfully applied the appropriate principles.',
      underlyingMentalModel: 'Correct understanding of the target concept.',
      rootCauseAnalysis: 'The student successfully applied the appropriate principles.',
      whyChosenDistractorPicked: 'N/A - Correct option was selected.',
      remedyStrategy: 'Advance to higher-order synthesis questions.',
      comparativeInsight: {
        traditionalResponse: 'Move to next difficulty level (+1 level).',
        misfireResponse: 'Validate mastery and present deep application task.'
      }
    };
  }

  const taxonomyMatch: Misconception | null = knownMisconceptionId ? getMisconceptionById(knownMisconceptionId) : null;

  if (groq) {
    try {
      const systemPrompt = `You are a misconception classifier. Respond ONLY with valid JSON containing keys: misconceptionId, confidence, flawedMentalModel, distractorAnalysis, rootCause, remedyStrategy.`;
      const userPrompt = `Question: "${question}"\nCorrect Answer: "${correctAnswerText}"\nStudent Selected Wrong Answer: "${selectedOptionText}"\n${studentReasoning ? `Student Reasoning: "${studentReasoning}"` : ''}\nKnown Misconception Reference: ${taxonomyMatch ? `${taxonomyMatch.id} - ${taxonomyMatch.label}: ${taxonomyMatch.description}` : 'Unknown'}`;

      const res = await callGroq<{
        misconceptionId: string;
        confidence: number;
        flawedMentalModel: string;
        distractorAnalysis: string;
        rootCause: string;
        remedyStrategy: string;
      }>(systemPrompt, userPrompt);

      const matchedMisc = getMisconceptionById(res.misconceptionId) || taxonomyMatch;

      return {
        misconceptionId: res.misconceptionId || taxonomyMatch?.id || 'denominator_ignored',
        misconceptionName: matchedMisc?.label || taxonomyMatch?.label || 'Diagnosed Cognitive Gap',
        category: 'Cognitive Misconception Flaw',
        confidenceScore: res.confidence || 0.95,
        flawedMentalModel: res.flawedMentalModel || matchedMisc?.description,
        distractorAnalysis: res.distractorAnalysis || `Selected "${selectedOptionText}" due to flawed belief.`,
        rootCause: res.rootCause || 'Fundamental domain boundary gap.',
        underlyingMentalModel: res.flawedMentalModel || matchedMisc?.description || 'Flawed mental model detected.',
        rootCauseAnalysis: res.rootCause || matchedMisc?.description || 'Deep cognitive gap.',
        whyChosenDistractorPicked: res.distractorAnalysis || `Selected "${selectedOptionText}".`,
        remedyStrategy: res.remedyStrategy || `Use concrete counter-examples to demonstrate the boundary condition.`,
        comparativeInsight: {
          traditionalResponse: 'Lower question difficulty by 1 level or repeat generic subject quiz.',
          misfireResponse: `Target exact cognitive gap [${res.misconceptionId}]: ${res.remedyStrategy}`
        }
      };
    } catch (err) {
      console.warn('Groq diagnose failed, using fallback:', err);
    }
  }

  // Fallback
  const fallbackMisc = taxonomyMatch || getMisconceptionById('denominator_ignored');
  const fModel = fallbackMisc?.description || 'Added or subtracted numerators and denominators separately.';
  const fDistractor = `The option "${selectedOptionText}" directly results from adding numerators and denominators independently.`;
  const fRoot = 'Lack of fractional unit scale understanding — failing to realize that fractions represent ratios of a unified whole unit.';
  const fRemedy = 'Use visual fraction tile diagrams or pizza slice area models to demonstrate why unit size must match before combining parts.';

  return {
    misconceptionId: fallbackMisc?.id || 'denominator_ignored',
    misconceptionName: fallbackMisc?.label || 'Denominator Ignored',
    category: 'Tagged Taxonomy Gap',
    confidenceScore: 0.95,
    flawedMentalModel: fModel,
    distractorAnalysis: fDistractor,
    rootCause: fRoot,
    underlyingMentalModel: fModel,
    rootCauseAnalysis: fRoot,
    whyChosenDistractorPicked: fDistractor,
    remedyStrategy: fRemedy,
    comparativeInsight: {
      traditionalResponse: 'Lower question difficulty by 1 level or repeat generic subject quiz.',
      misfireResponse: `Target exact tagged cognitive gap [${fallbackMisc?.id}]: ${fRemedy}`
    }
  };
}

/**
 * High-level helper for UI follow-up generation
 */
export async function generateFollowupQuestion(params: {
  question: string;
  selectedOptionText: string;
  diagnosis: DiagnosisResult;
}): Promise<FollowupQuestionResult> {
  const { question, selectedOptionText, diagnosis } = params;

  if (groq) {
    try {
      const systemPrompt = `You are a math and science question generator. A student showed this misconception: ${diagnosis.misconceptionId} - ${diagnosis.flawedMentalModel || diagnosis.underlyingMentalModel}. Generate ONE new multiple-choice question on the same topic that tests whether they still hold this misconception. Respond ONLY with valid JSON: { question: string, options: string[4], correctAnswerIndex: number, whyThisTargetsIt: string }`;
      const userPrompt = `Original Question: "${question}"\nStudent Answered: "${selectedOptionText}"\nGenerate follow-up question for diagnosed misconception: ${diagnosis.misconceptionName} (${diagnosis.misconceptionId})`;

      const res = await callGroq<{
        question: string;
        options: string[];
        correctAnswerIndex: number;
        whyThisTargetsIt: string;
      }>(systemPrompt, userPrompt);

      return {
        question: res.question,
        targetMisconception: diagnosis.misconceptionName,
        conceptualBridge: res.whyThisTargetsIt || 'Isolates the core operational variable to dismantle the mental model flaw.',
        options: res.options.map((optText, idx) => ({
          id: String.fromCharCode(97 + idx),
          text: optText,
          isCorrect: idx === res.correctAnswerIndex,
          explanation: idx === res.correctAnswerIndex ? 'Correct answer.' : 'Incorrect option.'
        })),
        explanation: res.whyThisTargetsIt || 'Explains the conceptual bridge.',
        hint: 'Focus on how the operation acts on the whole unit.'
      };
    } catch (err) {
      console.warn('Groq follow-up call failed, using fallback:', err);
    }
  }

  // Fallback follow-up
  return {
    question: `Suppose you have 1/2 of a pizza and your friend gives you 1/2 of another pizza. If you add numerators and denominators separately (1+1 / 2+2 = 2/4 = 1/2), how much pizza do you end up with?`,
    targetMisconception: diagnosis.misconceptionName,
    conceptualBridge: `Demonstrates the absurdity of adding denominators: adding half a pizza to half a pizza would result in half a pizza!`,
    options: [
      { id: 'a', text: '1/2 pizza', isCorrect: false, explanation: 'Two half pizzas make a whole pizza (1), not a half.' },
      { id: 'b', text: '1 whole pizza', isCorrect: true, explanation: 'Correct! 1/2 + 1/2 = 2/2 = 1 whole pizza.' },
      { id: 'c', text: '2/4 pizza', isCorrect: false, explanation: '2/4 is equal to 1/2.' },
      { id: 'd', text: '1/4 pizza', isCorrect: false, explanation: 'Adding portions cannot result in a smaller portion.' }
    ],
    explanation: 'Adding equal parts means adding numerators over the shared denominator (1/2 + 1/2 = 2/2 = 1).',
    hint: 'Visualize combining two half-slices of pizza in real life.'
  };
}
