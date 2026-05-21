const {
  buildBriefListQuery,
  createBrief,
  deleteBrief
} = require('../src/services/briefService');

const validBriefInput = {
  title: 'Spring Sale Meta Campaign',
  brandName: 'Nova Shoes',
  platform: 'Meta',
  objective: 'Sales',
  budget: 5000,
  startDate: '2026-05-20',
  deadline: '2026-05-25',
  targetAudience: '18-34 online shoppers',
  priority: 'High',
  status: 'In Progress',
  notes: 'Prepare creative variations.'
};

const databaseRow = {
  id: 99,
  user_id: 5,
  title: 'Spring Sale Meta Campaign',
  brand_name: 'Nova Shoes',
  platform: 'Meta',
  objective: 'Sales',
  budget: 5000,
  start_date: '2026-05-20',
  deadline: '2026-05-25',
  target_audience: '18-34 online shoppers',
  priority: 'High',
  status: 'In Progress',
  notes: 'Prepare creative variations.',
  created_at: '2026-05-20 12:00:00',
  updated_at: '2026-05-20 12:00:00'
};

describe('briefService business logic', () => {
  test('buildBriefListQuery always scopes records by authenticated user ID', () => {
    const { sql, params } = buildBriefListQuery(7, {
      search: 'nova',
      status: 'Ready',
      platform: 'Meta',
      priority: 'High'
    });

    expect(sql).toContain('WHERE user_id = ?');
    expect(sql).toContain('LOWER(title) LIKE ?');
    expect(sql).toContain('status = ?');
    expect(sql).toContain('platform = ?');
    expect(sql).toContain('priority = ?');
    expect(params[0]).toBe(7);
    expect(params).toContain('Ready');
    expect(params).toContain('Meta');
    expect(params).toContain('High');
  });

  test('createBrief inserts a record with the authenticated user ID', async () => {
    const fakeDb = {
      run: jest.fn().mockResolvedValue({ lastID: 99 }),
      get: jest.fn().mockResolvedValue(databaseRow)
    };

    const result = await createBrief(fakeDb, 5, validBriefInput);
    const insertParams = fakeDb.run.mock.calls[0][1];

    expect(insertParams[0]).toBe(5);
    expect(result.id).toBe(99);
    expect(result.userId).toBe(5);
  });

  test('createBrief rejects invalid input before inserting into database', async () => {
    const fakeDb = {
      run: jest.fn(),
      get: jest.fn()
    };

    await expect(
      createBrief(fakeDb, 5, { ...validBriefInput, budget: 0 })
    ).rejects.toThrow('Validation failed.');

    expect(fakeDb.run).not.toHaveBeenCalled();
  });

  test('deleteBrief deletes only records matching both brief ID and authenticated user ID', async () => {
    const fakeDb = {
      run: jest.fn().mockResolvedValue({ changes: 1 })
    };

    const result = await deleteBrief(fakeDb, 5, 99);
    const deleteParams = fakeDb.run.mock.calls[0][1];

    expect(deleteParams).toEqual([99, 5]);
    expect(result.deleted).toBe(true);
  });
});
