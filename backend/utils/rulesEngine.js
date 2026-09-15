/**
 * Rules Engine for evaluating student applications against campus placement policies.
 * You can add, remove, or modify rules in the `rules` array.
 */
export const evaluateApplicationRules = (user, job) => {
  const rules = [
    {
      name: 'One-Student-One-Job',
      check: (u, j) => !u.isPlaced,
      errorMessage: 'You have already been placed and cannot apply for further jobs.'
    },
    {
      name: 'CGPA-Eligibility',
      check: (u, j) => (u.cgpa !== null && u.cgpa >= j.minCgpa),
      errorMessage: `Your CGPA (${u.cgpa}) is below the minimum requirement (${j.minCgpa}) for this job.`
    }
    // Add "Dream Company" logic here in the future by extending the One-Student-One-Job check
  ];

  for (const rule of rules) {
    if (!rule.check(user, job)) {
      return { allowed: false, reason: rule.errorMessage };
    }
  }

  return { allowed: true };
};
