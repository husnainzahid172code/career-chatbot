export function analyzeResumeText(text, jobDescription = "") {
  const lower = text.toLowerCase();
  const skillKeywords = [
    "javascript",
    "python",
    "react",
    "node",
    "sql",
    "communication",
    "leadership",
    "problem solving"
  ];

  const presentSkills = skillKeywords.filter((s) => lower.includes(s));
  const missing = skillKeywords.filter((s) => !lower.includes(s));
  const atsScore = Math.min(100, Math.round((presentSkills.length / skillKeywords.length) * 100));

  let jobMatch = "No job description provided.";
  if (jobDescription.trim()) {
    const jd = jobDescription.toLowerCase();
    const jdMatches = presentSkills.filter((s) => jd.includes(s));
    jobMatch = `Matched ${jdMatches.length} shared skill keywords with the provided job description.`;
  }

  return {
    atsScore,
    extractedSkills: presentSkills,
    missingKeywords: missing.slice(0, 8),
    jobMatch,
    summary: "Resume analysis completed. Improve measurable achievements and keyword alignment."
  };
}

