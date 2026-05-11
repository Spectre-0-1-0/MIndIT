export const scoreRanges = {
  ghq12: [0, 36],
  flourishing: [8, 56],
  digitalStress: [24, 120],
  pss10: [0, 40],
  rses: [0, 30],
  bdi2: [0, 63],
  bai: [0, 63],
  bfi10: [1, 5],
};

const average = (values) => {
  const valid = values.filter((value) => typeof value === 'number' && !Number.isNaN(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
};

export function calculateGHQ12Score(answers) {
  if (!Array.isArray(answers)) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function calculateFlourishingScore(answers) {
  if (!Array.isArray(answers)) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function calculateDigitalStressScore(answers) {
  if (!Array.isArray(answers)) return {
    availabilityStress: 0,
    approvalAnxiety: 0,
    fearOfMissingOut: 0,
    connectionOverload: 0,
    onlineVigilance: 0,
  };

  const availabilityStress = average([answers[0], answers[7], answers[15], answers[17]]);
  const approvalAnxiety = average([answers[2], answers[8], answers[16], answers[19], answers[21], answers[23]]);
  const fearOfMissingOut = average([answers[4], answers[9], answers[12], answers[20]]);
  const connectionOverload = average([answers[1], answers[5], answers[10], answers[13], answers[18], answers[22]]);
  const onlineVigilance = average([answers[3], answers[6], answers[11], answers[14]]);

  return {
    availabilityStress,
    approvalAnxiety,
    fearOfMissingOut,
    connectionOverload,
    onlineVigilance,
  };
}

export function calculatePSS10Score(answers) {
  if (!Array.isArray(answers)) return { total: 0, subscales: { helplessness: 0, lackOfSelfEfficacy: 0 } };

  const reverseIndices = [3, 4, 6, 7];
  const scored = answers.map((value, index) => {
    const numeric = Number(value || 0);
    return reverseIndices.includes(index) ? 4 - numeric : numeric;
  });

  const total = scored.reduce((sum, value) => sum + value, 0);
  const helplessness = [0, 1, 2, 5, 8, 9].reduce((sum, idx) => sum + scored[idx], 0);
  const lackOfSelfEfficacy = [3, 4, 6, 7].reduce((sum, idx) => sum + scored[idx], 0);

  return {
    total,
    subscales: {
      helplessness,
      lackOfSelfEfficacy,
    },
  };
}

export function calculateRSESScore(answers) {
  if (!Array.isArray(answers)) return 0;

  const reverseIndices = [1, 4, 5, 7, 8];
  return answers.reduce((sum, value, index) => {
    const numeric = Number(value || 0);
    return sum + (reverseIndices.includes(index) ? 3 - numeric : numeric);
  }, 0);
}

export function calculateBdi2Score(answers) {
  if (!Array.isArray(answers)) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function calculateBaiScore(answers) {
  if (!Array.isArray(answers)) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0);
}

// BFI-10 Scoring Functions
// BFI-10 uses 10 questions to measure 5 traits (O, C, E, A, N)
// Each trait is measured by 2 items

export function calculateBFI10Score(answers, questions) {
  if (!Array.isArray(answers) || !Array.isArray(questions)) {
    return { O: 0, C: 0, E: 0, A: 0, N: 0 };
  }

  // Group questions by trait
  const traitQuestions = {
    O: [], // Openness
    C: [], // Conscientiousness
    E: [], // Extraversion
    A: [], // Agreeableness
    N: [], // Neuroticism
  };

  questions.forEach((q, index) => {
    if (traitQuestions[q.trait]) {
      traitQuestions[q.trait].push({
        value: answers[index],
        reverse: q.reverse || false,
      });
    }
  });

  // Calculate average score for each trait (scale 1-5, convert to 1-10)
  const traits = {};
  Object.keys(traitQuestions).forEach((trait) => {
    const items = traitQuestions[trait];
    if (items.length > 0) {
      const sum = items.reduce((acc, item) => {
        let val = item.value || 0;
        if (item.reverse) {
          val = 6 - val; // Reverse score (1->5, 2->4, 3->3, 4->2, 5->1)
        }
        return acc + val;
      }, 0);
      // Convert from 1-5 scale to 1-10 scale
      const avg = (sum / items.length) * 2;
      traits[trait] = Math.round(avg);
    } else {
      traits[trait] = 0;
    }
  });

  return traits;
}

export function interpretBFI10(traits) {
  const interpretation = {};

  // Openness interpretation
  if (traits.O >= 8) {
    interpretation.O = 'High openness: You are imaginative, curious, and appreciate art and new experiences.';
  } else if (traits.O >= 5) {
    interpretation.O = 'Moderate openness: You have a balanced appreciation for both tradition and novelty.';
  } else {
    interpretation.O = 'Lower openness: You prefer familiar routines and practical approaches.';
  }

  // Conscientiousness interpretation
  if (traits.C >= 8) {
    interpretation.C = 'High conscientiousness: You are organized, disciplined, and goal-oriented.';
  } else if (traits.C >= 5) {
    interpretation.C = 'Moderate conscientiousness: You balance planning with flexibility.';
  } else {
    interpretation.C = 'Lower conscientiousness: You may prefer spontaneity over strict organization.';
  }

  // Extraversion interpretation
  if (traits.E >= 8) {
    interpretation.E = 'High extraversion: You are sociable, energetic, and enjoy being around people.';
  } else if (traits.E >= 5) {
    interpretation.E = 'Moderate extraversion: You enjoy social interaction but also value alone time.';
  } else {
    interpretation.E = 'Lower extraversion: You tend to be reserved and prefer quieter environments.';
  }

  // Agreeableness interpretation
  if (traits.A >= 8) {
    interpretation.A = 'High agreeableness: You are compassionate, trusting, and cooperative with others.';
  } else if (traits.A >= 5) {
    interpretation.A = 'Moderate agreeableness: You balance cooperation with assertiveness.';
  } else {
    interpretation.A = 'Lower agreeableness: You may be more skeptical and competitive in nature.';
  }

  // Neuroticism interpretation
  if (traits.N >= 8) {
    interpretation.N = 'Higher neuroticism: You may experience more stress and emotional ups and downs.';
  } else if (traits.N >= 5) {
    interpretation.N = 'Moderate neuroticism: You experience a normal range of emotional responses.';
  } else {
    interpretation.N = 'Lower neuroticism: You are generally calm and emotionally stable.';
  }

  return interpretation;
}

export function interpretGHQ12(score) {
  if (score <= 11) {
    return {
      title: 'Below threshold',
      description: 'No significant psychiatric morbidity is indicated by your GHQ-12 score.',
      details: [
        'Your total score is within the expected range for well-being.',
        'Continue regular self-care and awareness of your mental health.',
        'This assessment is a screening tool, not a clinical diagnosis.',
      ],
    };
  }
  return {
    title: 'Possible psychiatric morbidity',
    description: 'Your GHQ-12 score is at or above the threshold for possible psychiatric morbidity.',
    details: [
      'Consider following up with a qualified health professional.',
      'This result suggests additional assessment may be helpful.',
      'Use this information as a guide rather than a diagnosis.',
    ],
  };
}

export function interpretFlourishing(score) {
  if (score >= 50) {
    return {
      title: 'High Flourishing',
      description: 'You are experiencing strong positive functioning and well-being.',
      details: [
        'You likely feel purposeful and connected.',
        'Continue to nurture the aspects of life that support your well-being.',
        'This is an encouraging sign, but not a clinical assessment.',
      ],
    };
  }
  if (score >= 38) {
    return {
      title: 'Moderate Flourishing',
      description: 'You are generally doing well but may have room to grow.',
      details: [
        'You have positive strengths to build on.',
        'Consider focusing on relationships, purpose, or optimism.',
        'Use this insight to support your emotional wellness.',
      ],
    };
  }
  if (score >= 27) {
    return {
      title: 'Low Flourishing',
      description: 'Some key areas of well-being could use more attention.',
      details: [
        'Reflect on your sense of purpose and social support.',
        'Small, consistent actions may help improve your mood.',
        'This is a guide, not a diagnosis.',
      ],
    };
  }
  return {
    title: 'Very Low Flourishing',
    description: 'Your current sense of well-being appears limited in many areas.',
    details: [
      'Consider reaching out to trusted supports or a counselor.',
      'Focus on rest, self-compassion, and gradual steps forward.',
      'Professional help may be especially valuable at this time.',
    ],
  };
}

export function interpretDigitalStress(scores) {
  const overallAverage = typeof scores === 'number' ? scores : average(Object.values(scores));
  let title = 'Digital Stress';
  let description = 'Your digital stress score provides insight into how online life is affecting you.';

  if (overallAverage <= 2) {
    title = 'Low Digital Stress';
    description = 'You are experiencing relatively low stress from digital life.';
  } else if (overallAverage <= 3.5) {
    title = 'Moderate Digital Stress';
    description = 'You are noticing some digital stress, and it may help to build healthier boundaries online.';
  } else {
    title = 'High Digital Stress';
    description = 'Digital life may be contributing significantly to your stress.';
  }

  return {
    title,
    description,
    details: [
      'Use this result to think about digital habits that support your wellbeing.',
      'Consider reducing notifications, taking breaks, and setting clear boundaries.',
      'If digital stress feels persistent, talk with a trusted person or counselor.',
    ],
  };
}

export function interpretPSS10(score) {
  if (score <= 13) {
    return {
      title: 'Low Stress',
      description: 'Your perceived stress is below average.',
      details: [
        'You appear to be managing stress well currently.',
        'Continue with healthy coping and regular self-care.',
        'This is informative only and not a diagnosis.',
      ],
    };
  }
  if (score <= 26) {
    return {
      title: 'Moderate Stress',
      description: 'Your stress level falls within the average range.',
      details: [
        'Many people experience similar levels of stress.',
        'Consider strategies to ease pressure and increase balance.',
        'Monitor how your stress evolves over time.',
      ],
    };
  }
  return {
    title: 'High Stress',
    description: 'Your perceived stress is elevated.',
    details: [
      'It may help to seek additional support or self-care.',
      'Professional guidance can help manage persistent pressure.',
      'This is a screening tool, not a clinical evaluation.',
    ],
  };
}

export function interpretRSES(score) {
  if (score >= 26) {
    return {
      title: 'High Self-Esteem',
      description: 'You have a positive and healthy self-regard.',
      details: [
        'Your self-esteem appears strong and resilient.',
        'Maintain supportive habits and positive self-talk.',
        'This result is informational and not clinical advice.',
      ],
    };
  }
  if (score >= 15) {
    return {
      title: 'Normal / Average Self-Esteem',
      description: 'Your self-esteem is generally within a healthy range.',
      details: [
        'You likely feel reasonably confident and capable.',
        'You can continue building self-worth through supportive practices.',
        'If you feel low, consider talking to someone you trust.',
      ],
    };
  }
  return {
    title: 'Low Self-Esteem',
    description: 'Your responses suggest lower self-worth and confidence.',
    details: [
      'Self-compassion and positive support may help.',
      'Consider reaching out to trusted friends or a professional.',
      'This is for self-awareness and not a diagnosis.',
    ],
  };
}

export function interpretBdi2(score) {
  if (score <= 13) {
    return {
      title: 'Minimal Depression',
      description: 'Your symptoms are minimal or absent.',
      details: [
        'Continue monitoring your feelings and self-care.',
        'Share concerns with someone trusted if they arise.',
        'This is a screening result, not a formal diagnosis.',
      ],
    };
  }
  if (score <= 19) {
    return {
      title: 'Mild Depression',
      description: 'Some depressive symptoms are present.',
      details: [
        'You may benefit from supportive strategies or check-ins.',
        'Monitor changes in mood and energy over time.',
        'Professional support can be helpful if symptoms persist.',
      ],
    };
  }
  if (score <= 28) {
    return {
      title: 'Moderate Depression',
      description: 'Symptoms may be interfering with daily life.',
      details: [
        'Consider reaching out for counseling or support.',
        'Self-care alone may not be sufficient at this level.',
        'This is informational only and not a diagnosis.',
      ],
    };
  }
  return {
    title: 'Severe Depression',
    description: 'Symptoms are significant and may require immediate attention.',
    details: [
      'Please seek professional help promptly.',
      'If you feel unsafe, contact local emergency or crisis services.',
      'This assessment is not a substitute for clinical care.',
    ],
  };
}

export function interpretBai(score) {
  if (score <= 7) {
    return {
      title: 'Minimal Anxiety',
      description: 'Your anxiety symptoms are low.',
      details: [
        'This is consistent with normal levels of worry.',
        'Continue self-care and stress management habits.',
        'If anxiety changes, revisit your coping strategies.',
      ],
    };
  }
  if (score <= 15) {
    return {
      title: 'Mild Anxiety',
      description: 'You are experiencing mild anxiety symptoms.',
      details: [
        'Mild symptoms are common, but worth tracking.',
        'Relaxation and support can help reduce tension.',
        'This is a self-assessment, not clinical guidance.',
      ],
    };
  }
  if (score <= 25) {
    return {
      title: 'Moderate Anxiety',
      description: 'Your symptoms may affect daily functioning.',
      details: [
        'Consider reaching out for support or relaxation techniques.',
        'A mental health professional may be helpful.',
        'This result is informational only.',
      ],
    };
  }
  return {
    title: 'Severe Anxiety',
    description: 'Your anxiety symptoms are high and may warrant intervention.',
    details: [
      'Please seek professional support if you can.',
      'If you feel unsafe, contact crisis services immediately.',
      'This is not a clinical diagnosis.',
    ],
  };
}

export function calculateBFI10Score(answers) {
  if (!Array.isArray(answers) || answers.length !== 10) return {};

  // BFI-10 has 10 items mapping to 5 traits
  // Item mapping: 1=E, 2=A, 3=C, 4=N, 5=O, 6=E, 7=A, 8=C, 9=N, 10=O
  // With reverse scoring for items: 1, 3, 6, 9

  const scored = answers.map((value, index) => {
    const numeric = Number(value || 0);
    // Reverse score items 1, 3, 6, 9 (indices 0, 2, 5, 8)
    if ([0, 2, 5, 8].includes(index)) {
      return 6 - numeric; // Reverse: 1->5, 2->4, 3->3, 4->2, 5->1
    }
    return numeric;
  });

  // Calculate trait scores (average of 2 items each)
  const openness = (scored[4] + scored[9]) / 2; // Items 5, 10
  const conscientiousness = (scored[2] + scored[7]) / 2; // Items 3, 8 (reversed + normal)
  const extraversion = (scored[0] + scored[5]) / 2; // Items 1, 6 (both reversed)
  const agreeableness = (scored[1] + scored[6]) / 2; // Items 2, 7
  const neuroticism = (scored[3] + scored[8]) / 2; // Items 4, 9

  return {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,
  };
}

export function interpretBFI10(scores) {
  const interpretTrait = (score) => {
    if (score >= 4.5) return { level: 'Very High', description: 'You exhibit very strong characteristics in this trait.' };
    if (score >= 3.5) return { level: 'High', description: 'You show notably strong characteristics in this trait.' };
    if (score >= 2.5) return { level: 'Moderate', description: 'You show average levels of this trait.' };
    if (score >= 1.5) return { level: 'Low', description: 'You show lower levels of this trait.' };
    return { level: 'Very Low', description: 'You exhibit very low characteristics in this trait.' };
  };

  return {
    openness: {
      score: scores.openness,
      ...interpretTrait(scores.openness),
      details: [
        scores.openness >= 3.5
          ? 'You are intellectually curious, creative, and open to new experiences. You likely enjoy exploring new ideas and trying novel approaches.'
          : 'You tend to prefer familiar routines and practical approaches. You may be more traditional in your thinking and values.',
        scores.openness >= 3.5
          ? 'Your abstract thinking and creativity can be assets in problem-solving and innovation.'
          : 'Your preference for stability and proven methods can provide consistency and reliability.',
      ],
    },
    conscientiousness: {
      score: scores.conscientiousness,
      ...interpretTrait(scores.conscientiousness),
      details: [
        scores.conscientiousness >= 3.5
          ? 'You are organized, disciplined, and dependable. You likely plan ahead and take your responsibilities seriously.'
          : 'You may be more spontaneous and flexible. You tend to be relaxed about rules and schedules.',
        scores.conscientiousness >= 3.5
          ? 'Your strong work ethic and organizational skills can help you achieve your goals.'
          : 'Your flexibility allows you to adapt to changing circumstances more easily.',
      ],
    },
    extraversion: {
      score: scores.extraversion,
      ...interpretTrait(scores.extraversion),
      details: [
        scores.extraversion >= 3.5
          ? 'You are outgoing, energetic, and sociable. You enjoy being around others and are comfortable taking center stage.'
          : 'You are more reserved and introspective. You prefer smaller groups and may need time to recharge after social interaction.',
        scores.extraversion >= 3.5
          ? 'Your social confidence and enthusiasm can inspire others and build strong social networks.'
          : 'Your reflective nature allows for deep thinking and meaningful one-on-one connections.',
      ],
    },
    agreeableness: {
      score: scores.agreeableness,
      ...interpretTrait(scores.agreeableness),
      details: [
        scores.agreeableness >= 3.5
          ? 'You are compassionate, cooperative, and concerned about others. You value harmony and are quick to forgive.'
          : 'You are independent, competitive, and direct in your communication. You prioritize your own interests and may be skeptical of others.',
        scores.agreeableness >= 3.5
          ? 'Your empathy and cooperation skills make you an excellent team member and supportive friend.'
          : 'Your independence and critical thinking can help you make objective decisions.',
      ],
    },
    neuroticism: {
      score: scores.neuroticism,
      ...interpretTrait(scores.neuroticism),
      details: [
        scores.neuroticism >= 3.5
          ? 'You tend to experience more negative emotions and may be sensitive to stress. You worry more than average and can be anxious.'
          : 'You are generally emotionally stable and calm. You handle stress well and maintain composure.',
        scores.neuroticism >= 3.5
          ? 'Developing stress management techniques and emotional awareness can help you maintain well-being.'
          : 'Your emotional stability is a strength that helps you navigate challenges effectively.',
      ],
    },
  };
}

export function interpretAssessment(type, value) {
  switch (type) {
    case 'ghq12':
      return interpretGHQ12(value);
    case 'flourishing':
      return interpretFlourishing(value);
    case 'digitalStress':
    case 'digital-stress-scale':
      return interpretDigitalStress(value);
    case 'pss10':
      return interpretPSS10(value);
    case 'rses':
      return interpretRSES(value);
    case 'bdi2':
      return interpretBdi2(value);
    case 'bai':
      return interpretBai(value);
    case 'bfi10':
      return interpretBFI10(value);
    default:
      return {
        title: 'Assessment Result',
        description: 'No interpretation is available for this assessment.',
        details: ['Use the result as general guidance only.'],
      };
  }
}
