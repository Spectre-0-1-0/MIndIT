export const scoreRanges = {
  ghq12: [0, 36],
  flourishing: [8, 56],
  digitalStress: [24, 120],
  pss10: [0, 40],
  rses: [0, 30],
  bdi2: [0, 63],
  bai: [0, 63],
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

export function interpretGHQ12(score) {
  if (score <= 4) {
    return {
      title: 'Low Distress',
      description: 'Your responses indicate minimal current psychological distress.',
      details: [
        'No significant signs of acute mental strain.',
        'Continue using self-care and awareness strategies.',
        'This screen is not a clinical diagnosis.',
      ],
    };
  }
  if (score <= 8) {
    return {
      title: 'Moderate Distress',
      description: 'Your responses suggest moderate discomfort or strain.',
      details: [
        'Consider checking in with a trusted friend or advisor.',
        'Stress management and rest may help.',
        'If concerns persist, professional support may be beneficial.',
      ],
    };
  }
  return {
    title: 'High Distress',
    description: 'Your responses suggest a higher level of emotional distress.',
    details: [
      'Consider reaching out for additional support.',
      'It may help to speak with a counselor or mental health professional.',
      'This result is for informational purposes only.',
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
  const overallAverage = average(Object.values(scores));
  let title = 'Digital Stress';
  let description = 'Your digital stress profile provides insight into online pressures.';

  if (overallAverage <= 2) {
    title = 'Low Digital Stress';
    description = 'You are experiencing relatively low stress from digital life.';
  } else if (overallAverage <= 3.5) {
    title = 'Moderate Digital Stress';
    description = 'You experience a noticeable level of digital stress in some areas.';
  } else {
    title = 'High Digital Stress';
    description = 'Digital life may be contributing significantly to your stress.';
  }

  return {
    title,
    description,
    details: [
      `Availability Stress average: ${scores.availabilityStress.toFixed(2)}`,
      `Approval Anxiety average: ${scores.approvalAnxiety.toFixed(2)}`,
      `Fear of Missing Out average: ${scores.fearOfMissingOut.toFixed(2)}`,
      `Connection Overload average: ${scores.connectionOverload.toFixed(2)}`,
      `Online Vigilance average: ${scores.onlineVigilance.toFixed(2)}`,
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

export function interpretAssessment(type, value) {
  switch (type) {
    case 'ghq12':
      return interpretGHQ12(value);
    case 'flourishing':
      return interpretFlourishing(value);
    case 'digitalStress':
      return interpretDigitalStress(value);
    case 'pss10':
      return interpretPSS10(value);
    case 'rses':
      return interpretRSES(value);
    case 'bdi2':
      return interpretBdi2(value);
    case 'bai':
      return interpretBai(value);
    default:
      return {
        title: 'Assessment Result',
        description: 'No interpretation is available for this assessment.',
        details: ['Use the result as general guidance only.'],
      };
  }
}
