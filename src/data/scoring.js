export function calculateGHQ12Score(answers) {
  if (!Array.isArray(answers) || answers.length !== 12) return 0;
  // Bimodal scoring (0-0-1-1)
  return answers.reduce((sum, value) => {
    const score = Number(value || 0);
    return sum + (score >= 2 ? 1 : 0);
  }, 0);
}

export function interpretGHQ12(score) {
  if (score <= 11) {
    return {
      title: 'Below Threshold',
      description: 'Your responses suggest typical levels of well-being.',
      details: [
        'You seem to be handling daily challenges reasonably well.',
        'Continue practicing self-care and monitoring your mood.',
        'This is a screening result, not a formal diagnosis.',
      ],
    };
  }
  return {
    title: 'Possible Psychiatric Morbidity',
    description: 'Your responses indicate some emotional distress.',
    details: [
      'You may be experiencing more stress than usual.',
      'Consider speaking with a counselor or trusted support person.',
      'This result is informational and not clinical advice.',
    ],
  };
}

export function calculateFlourishingScore(answers) {
  if (!Array.isArray(answers) || answers.length !== 8) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function interpretFlourishing(score) {
  if (score >= 42) {
    return {
      title: 'High Flourishing',
      description: 'You have a strong sense of purpose and well-being.',
      details: [
        'You likely feel connected and capable in your daily life.',
        'Continue nurturing your positive relationships and goals.',
        'This is for self-awareness and not a diagnosis.',
      ],
    };
  }
  if (score >= 30) {
    return {
      title: 'Moderate Well-being',
      description: 'Your psychological well-being is in a healthy range.',
      details: [
        'There are areas of strength and areas for growth.',
        'Consider which aspects of life you would like to nurture more.',
        'This is informational and not clinical advice.',
      ],
    };
  }
  return {
    title: 'Needs Support',
    description: 'Your responses suggest lower psychological well-being.',
    details: [
      'You may benefit from exploring new supportive practices.',
      'Consider reaching out to a mentor or professional for guidance.',
      'This is for self-reflection and not a diagnosis.',
    ],
  };
}

export function calculateDigitalStressScore(answers) {
  if (!Array.isArray(answers) || answers.length === 0) return 0;
  return answers.reduce((sum, value) => sum + Number(value || 0), 0) / answers.length;
}

export function interpretDigitalStress(score) {
  if (score <= 2) {
    return {
      title: 'Low Digital Stress',
      description: 'Online life has a minimal negative impact on you.',
      details: [
        'You seem to have healthy boundaries with digital technology.',
        'Continue being mindful of your screen time and online interactions.',
        'This result is for general awareness.',
      ],
    };
  }
  if (score <= 3.5) {
    return {
      title: 'Moderate Digital Stress',
      description: 'You may be feeling some strain from digital life.',
      details: [
        'Building stronger boundaries with technology might help.',
        'Consider designated offline times to recharge.',
        'This is for self-awareness and not a diagnosis.',
      ],
    };
  }
  return {
    title: 'High Digital Stress',
    description: 'Digital life is likely contributing significantly to your stress.',
    details: [
      'It may be helpful to re-evaluate your relationship with technology.',
      'Seeking support to manage digital strain could be beneficial.',
      'This result is informational only.',
    ],
  };
}

export function calculatePSS10Score(answers) {
  if (!Array.isArray(answers) || answers.length !== 10) return 0;
  // Reverse score items: 4, 5, 7, 8 (indices 3, 4, 6, 7)
  const scored = answers.map((value, index) => {
    const numeric = Number(value || 0);
    if ([3, 4, 6, 7].includes(index)) {
      return 4 - numeric;
    }
    return numeric;
  });
  return scored.reduce((sum, value) => sum + value, 0);
}

export function interpretPSS10(score) {
  if (score <= 13) {
    return {
      title: 'Low Stress',
      description: 'You are experiencing low levels of perceived stress.',
      details: [
        'Your current coping mechanisms seem to be working well.',
        'Maintain your healthy stress management habits.',
        'This is a screening result, not a formal diagnosis.',
      ],
    };
  }
  if (score <= 26) {
    return {
      title: 'Moderate Stress',
      description: 'You are experiencing moderate perceived stress.',
      details: [
        'You might benefit from adding more relaxation or self-care.',
        'Professional guidance can help manage persistent pressure.',
        'This is a screening tool, not a clinical evaluation.',
      ],
    };
  }
  return {
    title: 'High Stress',
    description: 'You are experiencing high levels of perceived stress.',
    details: [
      'Consider reaching out for support or relaxation techniques.',
      'A mental health professional can help you develop coping strategies.',
      'This is informational only and not a diagnosis.',
    ],
  };
}

export function calculateRSESScore(answers) {
  if (!Array.isArray(answers) || answers.length !== 10) return 0;
  // Reverse score items: 2, 5, 6, 8, 9 (indices 1, 4, 5, 7, 8)
  const scored = answers.map((value, index) => {
    const numeric = Number(value || 0);
    if ([1, 4, 5, 7, 8].includes(index)) {
      return 3 - numeric;
    }
    return numeric;
  });
  return scored.reduce((sum, value) => sum + value, 0);
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

  const scored = answers.map((value, index) => {
    const numeric = Number(value || 0);
    // Reverse score items indices 2 (Q3) and 6 (Q7)
    if ([2, 6].includes(index)) {
      return 6 - numeric;
    }
    return numeric;
  });

  // Calculate trait scores based on mapping in BFI10.jsx
  const extraversion = scored[0]; // Q1
  const agreeableness = (scored[1] + scored[3]) / 2; // Q2, Q4
  const conscientiousness = (scored[2] + scored[7]) / 2; // Q3, Q8
  const neuroticism = (scored[4] + scored[6] + scored[8]) / 3; // Q5, Q7, Q9
  const openness = (scored[5] + scored[9]) / 2; // Q6, Q10

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
