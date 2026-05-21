const ALLOWED_PLATFORMS = ['Meta', 'Google', 'TikTok', 'LinkedIn', 'Other'];
const ALLOWED_OBJECTIVES = ['Awareness', 'Traffic', 'Leads', 'Sales'];
const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_STATUSES = ['Draft', 'In Progress', 'Ready', 'Published', 'Archived'];

function isValidDateString(value) {
  if (!value) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function normalizeOptionalString(value) {
  const trimmed = String(value || '').trim();
  return trimmed || null;
}

function validateBriefInput(input = {}) {
  const errors = {};
  const data = {
    title: String(input.title || '').trim(),
    brandName: String(input.brandName || '').trim(),
    platform: String(input.platform || '').trim(),
    objective: String(input.objective || '').trim(),
    budget: Number(input.budget),
    startDate: normalizeOptionalString(input.startDate),
    deadline: String(input.deadline || '').trim(),
    targetAudience: normalizeOptionalString(input.targetAudience),
    priority: String(input.priority || '').trim(),
    status: String(input.status || '').trim(),
    notes: normalizeOptionalString(input.notes)
  };

  if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  }

  if (data.brandName.length < 2) {
    errors.brandName = 'Brand name must be at least 2 characters long.';
  }

  if (!ALLOWED_PLATFORMS.includes(data.platform)) {
    errors.platform = `Platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}.`;
  }

  if (!ALLOWED_OBJECTIVES.includes(data.objective)) {
    errors.objective = `Objective must be one of: ${ALLOWED_OBJECTIVES.join(', ')}.`;
  }

  if (!Number.isFinite(data.budget) || data.budget <= 0) {
    errors.budget = 'Budget must be a positive number.';
  }

  if (data.startDate && !isValidDateString(data.startDate)) {
    errors.startDate = 'Start date must be a valid date in YYYY-MM-DD format.';
  }

  if (!isValidDateString(data.deadline)) {
    errors.deadline = 'Deadline must be a valid date in YYYY-MM-DD format.';
  }

  if (data.startDate && isValidDateString(data.startDate) && isValidDateString(data.deadline)) {
    const startDate = new Date(`${data.startDate}T00:00:00Z`);
    const deadline = new Date(`${data.deadline}T00:00:00Z`);

    if (deadline < startDate) {
      errors.deadline = 'Deadline cannot be earlier than start date.';
    }
  }

  if (!ALLOWED_PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`;
  }

  if (!ALLOWED_STATUSES.includes(data.status)) {
    errors.status = `Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data
  };
}

module.exports = {
  ALLOWED_PLATFORMS,
  ALLOWED_OBJECTIVES,
  ALLOWED_PRIORITIES,
  ALLOWED_STATUSES,
  validateBriefInput,
  isValidDateString
};
