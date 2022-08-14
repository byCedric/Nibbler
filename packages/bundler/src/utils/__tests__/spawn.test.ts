import { spawnSafeAsync } from '../spawn';

describe(spawnSafeAsync, () => {
  const oldEnv = { ...process.env };

  afterEach(() => {
    process.env = oldEnv;
  });

  it('runs command', async () => {
    await expect(spawnSafeAsync('node', ['--print', '"text"'])).resolves.toMatchObject({
      stdout: 'text\n',
    });
  });

  it('runs command with environment variables', async () => {
    await expect(
      spawnSafeAsync('node', ['--print', 'process.env.SOME_TEXT'], { env: { SOME_TEXT: 'public' } })
    ).resolves.toMatchObject({
      stdout: 'public\n',
    });
  });

  it('runs command without inherited environment variables', async () => {
    process.env.SUPER_SECRET = 'hello';

    await expect(
      spawnSafeAsync('node', ['--print', 'process.env.SUPER_SECRET'], {
        env: { SOME_TEXT: 'public' },
      })
    ).resolves.toMatchObject({
      stdout: 'undefined\n',
    });
  });
});
