function normalizePriority(p) {
  const map = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
  };
  return map[String(p ?? '').toLowerCase()] || 'medium';
}

module.exports = { normalizePriority };
