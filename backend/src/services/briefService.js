const AppError = require('../utils/AppError');
const {
  ALLOWED_PLATFORMS,
  ALLOWED_PRIORITIES,
  ALLOWED_STATUSES,
  validateBriefInput
} = require('../validators/briefValidator');

function mapBriefRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    brandName: row.brand_name,
    platform: row.platform,
    objective: row.objective,
    budget: row.budget,
    startDate: row.start_date,
    deadline: row.deadline,
    targetAudience: row.target_audience,
    priority: row.priority,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizeFilters(filters = {}) {
  const normalized = {
    search: String(filters.search || '').trim().toLowerCase(),
    status: String(filters.status || '').trim(),
    platform: String(filters.platform || '').trim(),
    priority: String(filters.priority || '').trim()
  };

  if (normalized.status && !ALLOWED_STATUSES.includes(normalized.status)) {
    throw new AppError('Invalid status filter.', 400);
  }

  if (normalized.platform && !ALLOWED_PLATFORMS.includes(normalized.platform)) {
    throw new AppError('Invalid platform filter.', 400);
  }

  if (normalized.priority && !ALLOWED_PRIORITIES.includes(normalized.priority)) {
    throw new AppError('Invalid priority filter.', 400);
  }

  return normalized;
}

function buildBriefListQuery(userId, filters = {}) {
  const normalized = normalizeFilters(filters);
  let sql = 'SELECT * FROM campaign_briefs WHERE user_id = ?';
  const params = [userId];

  if (normalized.search) {
    sql += ' AND (LOWER(title) LIKE ? OR LOWER(brand_name) LIKE ? OR LOWER(notes) LIKE ?)';
    const searchValue = `%${normalized.search}%`;
    params.push(searchValue, searchValue, searchValue);
  }

  if (normalized.status) {
    sql += ' AND status = ?';
    params.push(normalized.status);
  }

  if (normalized.platform) {
    sql += ' AND platform = ?';
    params.push(normalized.platform);
  }

  if (normalized.priority) {
    sql += ' AND priority = ?';
    params.push(normalized.priority);
  }

  sql += ' ORDER BY datetime(created_at) DESC, id DESC';

  return { sql, params };
}

async function listBriefs(db, userId, filters = {}) {
  const { sql, params } = buildBriefListQuery(userId, filters);
  const rows = await db.all(sql, params);
  return rows.map(mapBriefRow);
}

async function getBriefById(db, userId, briefId) {
  const row = await db.get(
    'SELECT * FROM campaign_briefs WHERE id = ? AND user_id = ?',
    [briefId, userId]
  );

  if (!row) {
    throw new AppError('Campaign brief not found.', 404);
  }

  return mapBriefRow(row);
}

async function createBrief(db, userId, input) {
  const validation = validateBriefInput(input);

  if (!validation.isValid) {
    throw new AppError('Validation failed.', 400, validation.errors);
  }

  const data = validation.data;
  const result = await db.run(
    `INSERT INTO campaign_briefs (
      user_id, title, brand_name, platform, objective, budget,
      start_date, deadline, target_audience, priority, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.title,
      data.brandName,
      data.platform,
      data.objective,
      data.budget,
      data.startDate,
      data.deadline,
      data.targetAudience,
      data.priority,
      data.status,
      data.notes
    ]
  );

  return getBriefById(db, userId, result.lastID);
}

async function updateBrief(db, userId, briefId, input) {
  await getBriefById(db, userId, briefId);

  const validation = validateBriefInput(input);

  if (!validation.isValid) {
    throw new AppError('Validation failed.', 400, validation.errors);
  }

  const data = validation.data;
  await db.run(
    `UPDATE campaign_briefs
     SET title = ?, brand_name = ?, platform = ?, objective = ?, budget = ?,
         start_date = ?, deadline = ?, target_audience = ?, priority = ?, status = ?,
         notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [
      data.title,
      data.brandName,
      data.platform,
      data.objective,
      data.budget,
      data.startDate,
      data.deadline,
      data.targetAudience,
      data.priority,
      data.status,
      data.notes,
      briefId,
      userId
    ]
  );

  return getBriefById(db, userId, briefId);
}

async function deleteBrief(db, userId, briefId) {
  const result = await db.run(
    'DELETE FROM campaign_briefs WHERE id = ? AND user_id = ?',
    [briefId, userId]
  );

  if (result.changes === 0) {
    throw new AppError('Campaign brief not found.', 404);
  }

  return {
    deleted: true,
    id: Number(briefId)
  };
}

async function getSummary(db, userId) {
  const totalRow = await db.get(
    'SELECT COUNT(*) AS total FROM campaign_briefs WHERE user_id = ?',
    [userId]
  );

  const statusRows = await db.all(
    'SELECT status, COUNT(*) AS count FROM campaign_briefs WHERE user_id = ? GROUP BY status',
    [userId]
  );

  const byStatus = {};

  for (const status of ALLOWED_STATUSES) {
    byStatus[status] = 0;
  }

  for (const row of statusRows) {
    byStatus[row.status] = row.count;
  }

  return {
    total: totalRow.total,
    byStatus
  };
}

module.exports = {
  mapBriefRow,
  normalizeFilters,
  buildBriefListQuery,
  listBriefs,
  getBriefById,
  createBrief,
  updateBrief,
  deleteBrief,
  getSummary
};
