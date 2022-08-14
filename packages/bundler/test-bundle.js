const fs = require('fs');
const path = require('path');

const { bundle } = require('.');

async function prepare() {
  const folder = path.resolve(__dirname, '..', '..', '.temp');

  await fs.promises.rm(folder, { force: true, recursive: true });
  await fs.promises.mkdir(folder, { recursive: true });
  await fs.promises.writeFile(
    path.join(folder, 'package.json'),
    JSON.stringify({ name: 'root', version: '0.0.0' }, undefined, 2)
  );

  return folder;
}

prepare()
  // --- expo@46.0.6
  // .then((cwd) =>
  //   bundle(
  //     {
  //       name: 'expo',
  //       version: '46.0.6',
  //       platforms: ['android'],
  //       // platforms: ['android', 'ios', 'web'],
  //     },
  //     { cwd }
  //   )
  // )
  // .then((result) => console.log('expo@46.0.6', result))
  // --- firebase@9.9.2
  // .then((cwd) =>
  //   bundle(
  //     {
  //       name: 'firebase',
  //       version: '9.9.2',
  //       platforms: ['android', 'ios', 'web'],
  //     },
  //     { cwd }
  //   )
  // )
  // .then((result) => console.log('firebase@9.9.2', result))
  // --- @firebase/app@0.7.30
  .then((cwd) =>
    bundle(
      {
        name: '@firebase/app',
        version: '0.7.30',
        platforms: ['android', 'ios', 'web'],
      },
      { cwd }
    )
  )
  .then((result) => console.log('@firebase/app@0.7.30', result))
  // --- @shopify/react-native-skia@0.1.140
  // .then((cwd) =>
  //   bundle(
  //     {
  //       name: '@shopify/react-native-skia',
  //       version: '0.1.140',
  //       platforms: ['android'],
  //     },
  //     { cwd }
  //   )
  // )
  // .then((result) => console.log('@shopify/react-native-skia@0.1.140', result))
  // --- error handling
  .catch((error) => console.error('FAILED', error, error.stack));

// bundle(
//   {
//     name: 'react-native-reanimated',
//     version: '^2.9.0',
//     // platforms: ['android'],
//     platforms: ['android', 'ios', 'web'],
//   },
//   {
//     cwd: path.resolve(__dirname, '..', '..', '.temp'),
//     // installer: ['pnpm'],
//   }
// )
//   .then((output) => {
//     console.log('Android', output.android.output);
//     console.log('Web', output.web.output);
//   })
//   .catch((error) => console.error('FAILED', error));
