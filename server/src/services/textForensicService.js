const AI_BUZZWORDS = [
  'delve', 'testament', 'tapestry', 'furthermore', 'moreover',
  'in conclusion', 'pivotal', 'crucial', 'beacon', 'unwavering',
  'realm', 'foster', 'harnessing', 'underscore', 'multifaceted',
  'meticulous', 'seamlessly', 'indispensable', 'paramount'
];

export function analyzeTextForensics(text) {
  if (!text || text.trim().length === 0) {
    return {
      deepfakeScore: 0,
      perplexityScore: 100,
      burstinessScore: 100,
      anomalies: ['Empty input text'],
    };
  }

  const cleanText = text.trim();
  const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const words = cleanText.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];

  if (sentences.length === 0 || words.length === 0) {
    return {
      deepfakeScore: 0,
      perplexityScore: 100,
      burstinessScore: 100,
      anomalies: ['Insufficient text length for statistical forensic evaluation.'],
    };
  }

  // 1. Burstiness (Sentence Length Variance)
  const sentenceLengths = sentences.map(s => (s.match(/\b\w+\b/g) || []).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);

  // Human writing has higher variance (burstiness > 6.0). AI writing is unnaturally uniform (burstiness < 3.5).
  const burstinessScore = Math.min(100, Math.round((stdDev / 8) * 100));

  // 2. AI Cliché and Buzzword Frequency
  let aiWordMatches = 0;
  const matchedWords = [];
  words.forEach(w => {
    if (AI_BUZZWORDS.includes(w)) {
      aiWordMatches++;
      if (!matchedWords.includes(w)) matchedWords.push(w);
    }
  });

  const buzzwordRatio = (aiWordMatches / words.length) * 100;

  // 3. Repetition & Vocabulary Richness (Type-Token Ratio)
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / words.length;

  // Synthesize AI Probability
  let syntheticScore = 15;
  const anomalies = [];

  if (stdDev < 3.2 && sentences.length >= 3) {
    syntheticScore += 35;
    anomalies.push(`Extremely low sentence length variation (std dev: ${stdDev.toFixed(2)}), typical of autoregressive language models.`);
  }

  if (buzzwordRatio > 1.8) {
    syntheticScore += 30;
    anomalies.push(`High density of prototypical LLM transitional markers (${matchedWords.slice(0, 5).join(', ')}).`);
  }

  if (ttr < 0.45 && words.length > 50) {
    syntheticScore += 15;
    anomalies.push('Repetitive n-gram syntactic cadence and vocabulary clustering.');
  }

  const finalScore = Math.min(99, Math.max(5, syntheticScore));

  return {
    deepfakeScore: finalScore,
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageSentenceLength: Math.round(avgLen * 10) / 10,
    burstinessScore: burstinessScore,
    vocabularyRichnessTTR: Math.round(ttr * 100),
    detectedAiBuzzwords: matchedWords,
    anomalies: anomalies.length > 0 ? anomalies : ['Natural human stylistic cadence and diverse sentence structure.'],
  };
}

