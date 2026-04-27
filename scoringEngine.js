// Fit Scoring Engine
window.ScoringEngine = {
  calculateFitScore: (volunteer, task) => {
    let score = {
      total: 0,
      breakdown: {
        skill: 0,
        location: 0,
        availability: 0,
        workload: 0,
      }
    };

    // 1. Skill Match (Max 50 points)
    const taskSkills = task.skills || [];
    const volSkills = volunteer.skills || [];
    if (taskSkills.length > 0) {
      let skillScore = 0;
      taskSkills.forEach(reqSkill => {
        const match = volSkills.find(s => s.name === reqSkill);
        if (match) {
          let pts = 50 / taskSkills.length;
          if (match.level === 'verified') pts *= 1.1; // +10%
          if (match.level === 'endorsed') pts *= 1.2; // +20%
          skillScore += pts;
        }
      });
      score.breakdown.skill = Math.min(50, Math.round(skillScore));
    } else {
      score.breakdown.skill = 50; // no specific skills required
    }

    // 2. Location Match (Max 20 points)
    if (task.zone === volunteer.zone) {
      score.breakdown.location = 20;
    } else if (task.zone === 'Any' || volunteer.zone === 'Any') {
      score.breakdown.location = 10;
    }

    // 3. Availability Match (Max 30 points)
    const taskTime = task.time; // e.g. "Morning", "Afternoon", "Evening"
    if (volunteer.availability.includes(taskTime) || taskTime === "Flexible") {
      score.breakdown.availability = 30;
    }

    // 4. Workload Penalty (Negative points)
    // If volunteer hours > 10, subtract 5 points per extra hour
    if (volunteer.hours_assigned > 10) {
      score.breakdown.workload = -((volunteer.hours_assigned - 10) * 5);
    }

    // Final total calculation (0 to 100 max)
    score.total = Math.max(0,
      score.breakdown.skill +
      score.breakdown.location +
      score.breakdown.availability +
      score.breakdown.workload
    );
    score.total = Math.min(100, score.total);

    return score;
  }
};
