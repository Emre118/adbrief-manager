const { getCurrentUser } = require('../src/services/authService');

describe('authService current user profile', () => {
  test('getCurrentUser returns only safe profile fields', async () => {
    const fakeDb = {
      get: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Emre',
        email: 'emre@example.com',
        password_hash: 'secret-hash',
        created_at: '2026-05-20 12:00:00'
      })
    };

    const result = await getCurrentUser(fakeDb, 1);

    expect(fakeDb.get).toHaveBeenCalledWith(
      'SELECT id, name, email FROM users WHERE id = ?',
      [1]
    );
    expect(result).toEqual({
      id: 1,
      name: 'Emre',
      email: 'emre@example.com'
    });
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('password_hash');
  });

  test('getCurrentUser rejects when the token user no longer exists', async () => {
    const fakeDb = {
      get: jest.fn().mockResolvedValue(null)
    };

    await expect(getCurrentUser(fakeDb, 99)).rejects.toThrow('User not found.');
  });
});
