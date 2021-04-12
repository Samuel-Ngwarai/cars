import * as server from './server';

if (require.main === module) {
  server.start().catch((err) => console.error(err))
} else {
  module.exports = {
    start: () =>
    server.start().catch((err) => console.error(err)),
    stop: (): void => {
      server.stop();
    },
  };
}
