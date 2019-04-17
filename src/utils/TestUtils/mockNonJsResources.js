// Mocking resources.
// https://stackoverflow.com/a/38015613/9599137

const noop = () => 1;

require.extensions['.svg'] = noop;
