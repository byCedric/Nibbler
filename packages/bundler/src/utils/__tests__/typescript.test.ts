import { vol } from 'memfs';

import { getDeclarationFiles } from '../typescript';

jest.mock('fs');

describe('getDeclarationFiles', () => {
  it('returns single declaration', () => {
    vol.fromJSON({
      '/node_modules/test/lib/index.d.ts': `export const hello: string;`,
    });

    expect(getDeclarationFiles('/node_modules/test/lib/index.d.ts')).toEqual([
      '/node_modules/test/lib/index.d.ts',
    ]);
  });

  it('skips imported library', () => {
    vol.fromJSON({
      '/node_modules/test/lib/index.d.ts': `import { ComponentType } from 'react'`,
    });

    expect(getDeclarationFiles('/node_modules/test/lib/index.d.ts')).toEqual([
      '/node_modules/test/lib/index.d.ts',
    ]);
  });

  it('returns file referenced declaration', () => {
    vol.fromJSON({
      '/node_modules/test/lib/one.d.ts': `export * from './second'`,
      '/node_modules/test/lib/second.d.ts': `export const hello: string;`,
    });

    expect(getDeclarationFiles('/node_modules/test/lib/one.d.ts')).toEqual([
      '/node_modules/test/lib/one.d.ts',
      '/node_modules/test/lib/second.d.ts',
    ]);
  });

  it('returns folder referenced declaration', () => {
    vol.fromJSON({
      '/node_modules/test/lib/one.d.ts': `export * from './other'`,
      '/node_modules/test/lib/other/index.d.ts': `export const hello: string;`,
    });

    expect(getDeclarationFiles('/node_modules/test/lib/one.d.ts')).toEqual([
      '/node_modules/test/lib/one.d.ts',
      '/node_modules/test/lib/other/index.d.ts',
    ]);
  });

  it('returns mixed referenced declaration', () => {
    vol.fromJSON({
      '/node_modules/test/lib/index.d.ts': `
        import { View } from 'react-native'
        export * from './one'
        export * from './two'
      `,
      '/node_modules/test/lib/one.d.ts': `export {}`,
      '/node_modules/test/lib/two/index.d.ts': `export * from './two-file'`,
      '/node_modules/test/lib/two/two-file.d.ts': `export {}`,
    });

    expect(getDeclarationFiles('/node_modules/test/lib/index.d.ts')).toEqual([
      '/node_modules/test/lib/index.d.ts',
      '/node_modules/test/lib/one.d.ts',
      '/node_modules/test/lib/two/index.d.ts',
      '/node_modules/test/lib/two/two-file.d.ts',
    ]);
  });
});
