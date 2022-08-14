import { fs, vol } from 'memfs';

afterEach(() => {
  vol.reset();
});

module.exports = fs;
