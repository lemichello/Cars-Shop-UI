module.exports = {
  name: 'shop',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/shop',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
