import spawnAsync, { SpawnOptions } from '@expo/spawn-async';

/**
 * Spawn a command without leaking any sensitive environment variables.
 * This is required when bundling untrusted libraries.
 */
export function spawnSafeAsync(
  command: string,
  flags?: readonly string[],
  options?: SpawnOptions
): ReturnType<typeof spawnAsync> {
  const env = { PATH: process.env.PATH, ...options?.env };

  return spawnAsync(command, flags, { ...options, env });
}
