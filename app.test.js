const app = require('./aap-prev')

describe('processData', () => {
  it('calculates duration of', () => {
    const route1 = app.route('7522 N Lombard St Portland OR',
      '1315 Fern St New Orleans LA')
    shouldEqual(route1.totalDuration);
  });
});


/* route('7522 N Lombard St Portland OR',
  '1315 Fern St New Orleans LA', response => callback()); */
