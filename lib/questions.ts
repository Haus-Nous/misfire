import { Topic, Misconception, Taxonomy, TAXONOMY } from './taxonomy';

export { type Topic, type Misconception, type Taxonomy, TAXONOMY };

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionId?: string;
  explanation?: string;
}

export interface Question {
  id: string;
  topic: Topic;
  question: string;
  options: Option[];
  correctAnswer: string;
  contextSnippet?: string;
  targetConcept?: string;
  explanation?: string;
}

// Alias for compatibility
export type DiagnosticQuestion = Question;

export const SEED_QUESTIONS: Question[] = [
  // --- FRACTIONS QUESTIONS ---
  {
    id: 'q-frac-01',
    topic: 'fractions',
    question: 'Calculate the sum of the two fractions: 1/4 + 2/3',
    correctAnswer: '11/12',
    targetConcept: 'Adding Fractions with Common Denominators',
    explanation: 'To add fractions with different denominators, find the lowest common denominator (12), convert to equivalent fractions (3/12 + 8/12), and add the numerators.',
    options: [
      {
        id: 'opt-a',
        text: '3/7',
        isCorrect: false,
        misconceptionId: 'denominator_ignored',
        explanation: 'You added numerators (1+2=3) and denominators (4+3=7) directly, ignoring the need for a common denominator.'
      },
      {
        id: 'opt-b',
        text: '3/12',
        isCorrect: false,
        misconceptionId: 'common_denom_confusion',
        explanation: 'Found common denominator 12, but added numerators (1+2=3) without scaling them to equivalent fractions.'
      },
      {
        id: 'opt-c',
        text: '11/12',
        isCorrect: true,
        explanation: 'Correct! 1/4 = 3/12 and 2/3 = 8/12. 3/12 + 8/12 = 11/12.'
      },
      {
        id: 'opt-d',
        text: '2/7',
        isCorrect: false,
        misconceptionId: 'whole_number_reasoning',
        explanation: 'Multiplied numerators (1*2=2) and added denominators as independent whole numbers.'
      }
    ]
  },
  {
    id: 'q-frac-02',
    topic: 'fractions',
    question: 'Which of the following fraction comparisons is correct?',
    correctAnswer: '1/2 is greater than 1/4',
    targetConcept: 'Fraction Magnitude & Denominator Scale',
    explanation: 'When numerators are equal, a smaller denominator means the whole is divided into fewer, larger parts.',
    options: [
      {
        id: 'opt-a',
        text: '1/4 is greater than 1/2 because 4 is greater than 2',
        isCorrect: false,
        misconceptionId: 'magnitude_misjudgment',
        explanation: 'Picked answer based on whole number ordering (4 > 2), misjudging fraction magnitude.'
      },
      {
        id: 'opt-b',
        text: '1/2 is greater than 1/4',
        isCorrect: true,
        explanation: 'Correct! 1/2 = 0.5 and 1/4 = 0.25.'
      },
      {
        id: 'opt-c',
        text: '1/4 and 1/2 are equal because both have 1 in the numerator',
        isCorrect: false,
        misconceptionId: 'whole_number_reasoning',
        explanation: 'Only compared numerators, ignoring part-whole fraction meaning.'
      },
      {
        id: 'opt-d',
        text: '1/4 is greater than 1/2 because 1/4 = 4/1',
        isCorrect: false,
        misconceptionId: 'inverse_operation_error',
        explanation: 'Inverted the fraction improperly when converting or comparing.'
      }
    ]
  },
  {
    id: 'q-frac-03',
    topic: 'fractions',
    question: 'Simplify and compute: 3/5 ÷ 1/2',
    correctAnswer: '6/5',
    targetConcept: 'Fraction Division via Reciprocal Multiplication',
    explanation: 'Dividing by a fraction is equivalent to multiplying by its reciprocal: 3/5 ÷ 1/2 = 3/5 × 2/1 = 6/5.',
    options: [
      {
        id: 'opt-a',
        text: '3/10',
        isCorrect: false,
        misconceptionId: 'inverse_operation_error',
        explanation: 'Multiplied straight across (3*1=3, 5*2=10) instead of multiplying by the reciprocal of 1/2.'
      },
      {
        id: 'opt-b',
        text: '6/5',
        isCorrect: true,
        explanation: 'Correct! 3/5 * 2/1 = 6/5.'
      },
      {
        id: 'opt-c',
        text: '4/7',
        isCorrect: false,
        misconceptionId: 'denominator_ignored',
        explanation: 'Added numerators (3+1=4) and denominators (5+2=7) instead of dividing.'
      },
      {
        id: 'opt-d',
        text: '2/5',
        isCorrect: false,
        misconceptionId: 'common_denom_confusion',
        explanation: 'Subtracted numerators and kept original denominator.'
      }
    ]
  },

  // --- ALGEBRA QUESTIONS ---
  {
    id: 'q-alg-01',
    topic: 'algebra',
    question: 'Simplify the algebraic expression: -(3x - 5) + 2x',
    correctAnswer: '-x + 5',
    targetConcept: 'Distributing Negative Signs in Algebraic Expressions',
    explanation: 'The negative sign outside -(3x - 5) distributes to both terms, yielding -3x + 5. Adding 2x gives -x + 5.',
    options: [
      {
        id: 'opt-a',
        text: '-x - 5',
        isCorrect: false,
        misconceptionId: 'sign_distribution_error',
        explanation: 'Failed to distribute the negative sign to -5, leaving it as -5 instead of +5.'
      },
      {
        id: 'opt-b',
        text: '-x + 5',
        isCorrect: true,
        explanation: 'Correct! -(3x - 5) + 2x = -3x + 5 + 2x = -x + 5.'
      },
      {
        id: 'opt-c',
        text: '5x - 5',
        isCorrect: false,
        misconceptionId: 'order_of_operations_mixup',
        explanation: 'Combined 3x and 2x first before applying the leading negative sign.'
      },
      {
        id: 'opt-d',
        text: '-4x',
        isCorrect: false,
        misconceptionId: 'like_terms_confusion',
        explanation: 'Combined variables and constants (-x + 5 = -4x) as if they were like terms.'
      }
    ]
  },
  {
    id: 'q-alg-02',
    topic: 'algebra',
    question: 'Expand the binomial expression: (x + 4)²',
    correctAnswer: 'x² + 8x + 16',
    targetConcept: 'Binomial Expansion (a + b)² = a² + 2ab + b²',
    explanation: '(x + 4)² means (x + 4)(x + 4). FOIL expansion yields x² + 4x + 4x + 16 = x² + 8x + 16.',
    options: [
      {
        id: 'opt-a',
        text: 'x² + 16',
        isCorrect: false,
        misconceptionId: 'exponent_distribution_fallacy',
        explanation: 'Incorrectly distributed the exponent 2 directly over addition, missing the 2ab middle term (8x).'
      },
      {
        id: 'opt-b',
        text: 'x² + 8x + 16',
        isCorrect: true,
        explanation: 'Correct! (x+4)(x+4) = x² + 8x + 16.'
      },
      {
        id: 'opt-c',
        text: '2x + 8',
        isCorrect: false,
        misconceptionId: 'order_of_operations_mixup',
        explanation: 'Multiplied terms by 2 instead of squaring the binomial.'
      },
      {
        id: 'opt-d',
        text: 'x² + 4x + 16',
        isCorrect: false,
        misconceptionId: 'like_terms_confusion',
        explanation: 'Only included one middle term (4x) instead of combining 4x + 4x = 8x.'
      }
    ]
  },
  {
    id: 'q-alg-03',
    topic: 'algebra',
    question: 'Solve for x in the equation: 3x + 9 = 24',
    correctAnswer: 'x = 5',
    targetConcept: 'Two-Step Equation Solving & Inverse Operations',
    explanation: 'Subtract 9 from both sides: 3x = 15. Then divide both sides by 3: x = 5.',
    options: [
      {
        id: 'opt-a',
        text: 'x = 11',
        isCorrect: false,
        misconceptionId: 'variable_isolation_error',
        explanation: 'Added 9 to 24 instead of subtracting 9 when moving across the equals sign (3x = 33 -> x = 11).'
      },
      {
        id: 'opt-b',
        text: 'x = 5',
        isCorrect: true,
        explanation: 'Correct! 3x = 15, so x = 5.'
      },
      {
        id: 'opt-c',
        text: 'x = 1.25',
        isCorrect: false,
        misconceptionId: 'order_of_operations_mixup',
        explanation: 'Divided 24 by 3 first before subtracting 9 (24/3 = 8; 8-9 = -1).'
      },
      {
        id: 'opt-d',
        text: 'x = 12x',
        isCorrect: false,
        misconceptionId: 'like_terms_confusion',
        explanation: 'Combined 3x and 9 into 12x before solving.'
      }
    ]
  },

  // --- PHOTOSYNTHESIS QUESTIONS ---
  {
    id: 'q-photo-01',
    topic: 'photosynthesis',
    question: 'What are the primary chemical reactants (inputs) required for photosynthesis to occur in plants?',
    correctAnswer: 'Carbon dioxide, water, and light energy',
    targetConcept: 'Photosynthetic Reactants (6CO₂ + 6H₂O + light)',
    explanation: 'Photosynthesis uses carbon dioxide from the air, water from the soil, and absorbed solar energy to synthesize glucose and release oxygen gas.',
    options: [
      {
        id: 'opt-a',
        text: 'Glucose and oxygen gas',
        isCorrect: false,
        misconceptionId: 'inputs_outputs_confusion',
        explanation: 'Glucose and oxygen are the PRODUCTS (outputs) of photosynthesis, not the reactants.'
      },
      {
        id: 'opt-b',
        text: 'Carbon dioxide, water, and light energy',
        isCorrect: true,
        explanation: 'Correct! 6CO₂ + 6H₂O + Light -> C₆H₁₂O₆ + 6O₂.'
      },
      {
        id: 'opt-c',
        text: 'Soil minerals, fertilizer nutrients, and nitrogen gas',
        isCorrect: false,
        misconceptionId: 'energy_source_misunderstanding',
        explanation: 'Believed plants absorb food/biomass directly from soil nutrients rather than synthesizing glucose from CO₂ and light.'
      },
      {
        id: 'opt-d',
        text: 'Oxygen gas, water, and heat energy',
        isCorrect: false,
        misconceptionId: 'gaseous_exchange_inversion',
        explanation: 'Assumed plants consume oxygen during photosynthesis instead of carbon dioxide.'
      }
    ]
  },
  {
    id: 'q-photo-02',
    topic: 'photosynthesis',
    question: 'Where do light-dependent reactions take place inside plant cells, and what do they produce?',
    correctAnswer: 'Thylakoid membranes of chloroplasts; producing ATP, NADPH, and O₂',
    targetConcept: 'Light-Dependent Reactions vs Calvin Cycle Location & Products',
    explanation: 'Light reactions occur in the thylakoid membranes where light energy excites chlorophyll, splitting water to generate ATP, NADPH, and oxygen gas.',
    options: [
      {
        id: 'opt-a',
        text: 'Stroma of chloroplasts; consuming ATP to fix CO₂ into glucose',
        isCorrect: false,
        misconceptionId: 'light_dark_reaction_mixup',
        explanation: 'Confused the light-dependent reactions with the Calvin cycle (light-independent reactions) in the stroma.'
      },
      {
        id: 'opt-b',
        text: 'Thylakoid membranes of chloroplasts; producing ATP, NADPH, and O₂',
        isCorrect: true,
        explanation: 'Correct! Thylakoids contain chlorophyll for light absorption and photolysis of water.'
      },
      {
        id: 'opt-c',
        text: 'Plant root cells; absorbing glucose from soil moisture',
        isCorrect: false,
        misconceptionId: 'energy_source_misunderstanding',
        explanation: 'Believed photosynthesis occurs in roots rather than green leaves with chloroplasts.'
      },
      {
        id: 'opt-d',
        text: 'Mitochondrial matrix; breaking down glucose for cellular work',
        isCorrect: false,
        misconceptionId: 'respiration_photosynthesis_overlap',
        explanation: 'Confused chloroplast photosynthetic light reactions with mitochondrial cellular respiration.'
      }
    ]
  },
  {
    id: 'q-photo-03',
    topic: 'photosynthesis',
    question: 'How do plants generate ATP energy for cellular processes: do they perform cellular respiration, or do they rely solely on photosynthesis?',
    correctAnswer: 'Plants perform BOTH photosynthesis (to make glucose) and cellular respiration (to break down glucose into ATP)',
    targetConcept: 'Plant Metabolism: Photosynthesis vs Cellular Respiration',
    explanation: 'Photosynthesis converts solar energy into stored chemical energy (glucose). Plant cells then perform cellular respiration in mitochondria to convert glucose into ATP for cellular work.',
    options: [
      {
        id: 'opt-a',
        text: 'Plants only perform photosynthesis; animals perform cellular respiration',
        isCorrect: false,
        misconceptionId: 'respiration_photosynthesis_overlap',
        explanation: 'Believed plants do not perform cellular respiration, assuming respiration is exclusive to animals.'
      },
      {
        id: 'opt-b',
        text: 'Plants perform BOTH photosynthesis (to make glucose) and cellular respiration (to break down glucose into ATP)',
        isCorrect: true,
        explanation: 'Correct! Plant cells have mitochondria and perform cellular respiration continuously day and night.'
      },
      {
        id: 'opt-c',
        text: 'Plants only perform cellular respiration in the dark when light is unavailable',
        isCorrect: false,
        misconceptionId: 'light_dark_reaction_mixup',
        explanation: 'Confused light reaction availability with continuous 24/7 cellular respiration.'
      },
      {
        id: 'opt-d',
        text: 'Plants convert oxygen directly into soil minerals without respiration',
        isCorrect: false,
        misconceptionId: 'inputs_outputs_confusion',
        explanation: 'Confused gas exchange products with cellular metabolic energy conversion.'
      }
    ]
  }
];

export const SAMPLE_QUESTIONS: Question[] = SEED_QUESTIONS;
