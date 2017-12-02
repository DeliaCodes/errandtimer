// const app = require('./aap-prev')

describe('route', () => {
  it('status is okay', (done) => {
    route(
      '7522 N Lombard St Portland OR',
      addErrand('1315 Fern St New Orleans LA'),
      (response, status) => {
        try {
          expect(status).to.eql('OK');
          done();
        } catch (e) {
          done(e);
        }
      },
    );
  });
});
