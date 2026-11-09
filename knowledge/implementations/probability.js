export function bayesPosterior(prior, sensitivity, falsePositiveRate) {
  for (const [name,value] of Object.entries({prior,sensitivity,falsePositiveRate})) {
    if (!Number.isFinite(value)||value<0||value>1) throw new Error(name+" must be between 0 and 1");
  }
  const evidenceProbability=sensitivity*prior+falsePositiveRate*(1-prior);
  if(evidenceProbability===0) throw new Error("Evidence has zero probability");
  return sensitivity*prior/evidenceProbability;
}
