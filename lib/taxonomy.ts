export type Topic = 'fractions' | 'algebra' | 'photosynthesis';

export interface Misconception {
  id: string;
  label: string;
  description: string;
}

export type TopicTaxonomy = Record<string, Misconception>;
export type Taxonomy = Record<Topic, TopicTaxonomy>;

export const TAXONOMY: Taxonomy = {
  fractions: {
    denominator_ignored: {
      id: 'denominator_ignored',
      label: 'Denominator Ignored',
      description: 'Added or subtracted numerators and denominators separately, ignoring the need for a common denominator'
    },
    whole_number_reasoning: {
      id: 'whole_number_reasoning',
      label: 'Whole Number Reasoning',
      description: 'Treated the fraction like a whole number, ignoring part-whole meaning'
    },
    common_denom_confusion: {
      id: 'common_denom_confusion',
      label: 'Common Denominator Confusion',
      description: 'Attempted to combine fractions without finding a common denominator'
    },
    magnitude_misjudgment: {
      id: 'magnitude_misjudgment',
      label: 'Magnitude Misjudgment',
      description: 'Picked an answer with the wrong relative size (e.g. thinks 1/4 > 1/2)'
    },
    inverse_operation_error: {
      id: 'inverse_operation_error',
      label: 'Inverse Operation Error',
      description: 'Applied the wrong operation when simplifying or converting'
    }
  },
  algebra: {
    sign_distribution_error: {
      id: 'sign_distribution_error',
      label: 'Sign Distribution Error',
      description: 'Failed to distribute negative signs across terms inside parentheses when expanding or simplifying'
    },
    exponent_distribution_fallacy: {
      id: 'exponent_distribution_fallacy',
      label: 'Exponent Distribution Fallacy',
      description: 'Incorrectly distributed exponents across additive terms inside parentheses like (a+b)² = a² + b²'
    },
    variable_isolation_error: {
      id: 'variable_isolation_error',
      label: 'Variable Isolation Error',
      description: 'Performed invalid inverse operations when moving terms across the equals sign to isolate a variable'
    },
    order_of_operations_mixup: {
      id: 'order_of_operations_mixup',
      label: 'Order of Operations Mixup',
      description: 'Evaluated addition/subtraction before multiplication/exponentiation, violating PEMDAS rules'
    },
    like_terms_confusion: {
      id: 'like_terms_confusion',
      label: 'Like Terms Confusion',
      description: 'Combined terms with different variables or powers as if they were like terms'
    }
  },
  photosynthesis: {
    inputs_outputs_confusion: {
      id: 'inputs_outputs_confusion',
      label: 'Inputs & Outputs Confusion',
      description: 'Confused the reactants (water, carbon dioxide) with the products (glucose, oxygen) of photosynthesis'
    },
    light_dark_reaction_mixup: {
      id: 'light_dark_reaction_mixup',
      label: 'Light vs Dark Reaction Mixup',
      description: 'Confused the light-dependent reactions with the Calvin cycle location, inputs, or energy carriers'
    },
    respiration_photosynthesis_overlap: {
      id: 'respiration_photosynthesis_overlap',
      label: 'Respiration vs Photosynthesis Mixup',
      description: 'Believed plants perform photosynthesis instead of cellular respiration, rather than performing both'
    },
    energy_source_misunderstanding: {
      id: 'energy_source_misunderstanding',
      label: 'Energy Source Misunderstanding',
      description: 'Believed plants absorb food directly from soil minerals rather than synthesizing glucose via light energy'
    },
    gaseous_exchange_inversion: {
      id: 'gaseous_exchange_inversion',
      label: 'Gaseous Exchange Inversion',
      description: 'Assumed plants consume oxygen and produce carbon dioxide as their primary photosynthetic gas exchange'
    }
  }
};

/**
 * Global lookup helper for a misconception across all topics
 */
export function getMisconceptionById(id: string): Misconception | null {
  for (const topicKey of Object.keys(TAXONOMY) as Topic[]) {
    const topicTax = TAXONOMY[topicKey];
    if (topicTax[id]) {
      return topicTax[id];
    }
  }
  return null;
}
