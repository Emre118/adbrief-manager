const { validateBriefInput } = require('../src/validators/briefValidator');

const validBrief = {
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

describe('briefValidator', () => {
  test('accepts a valid campaign brief', () => {
    const result = validateBriefInput(validBrief);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data.title).toBe('Spring Sale Meta Campaign');
  });

  test('rejects a negative budget', () => {
    const result = validateBriefInput({ ...validBrief, budget: -100 });

    expect(result.isValid).toBe(false);
    expect(result.errors.budget).toBeDefined();
  });

  test('rejects an invalid status', () => {
    const result = validateBriefInput({ ...validBrief, status: 'Finished' });

    expect(result.isValid).toBe(false);
    expect(result.errors.status).toBeDefined();
  });

  test('rejects a deadline earlier than start date', () => {
    const result = validateBriefInput({
      ...validBrief,
      startDate: '2026-05-30',
      deadline: '2026-05-20'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.deadline).toBeDefined();
  });
});
