import { expect } from 'chai';
import sinon from 'sinon';
import * as Main from './Main';
import * as CalendarUtils from '../utils/CalendarUtils/CalendarUtils';
import BasicCalendar from '../resources/BasicCalendar/BasicCalendar.json';

describe('Main', () => {
  describe('processData', () => {
    let renderCalendarWithContributionsSpy;

    beforeEach(() => {
      renderCalendarWithContributionsSpy = sinon.stub(CalendarUtils, 'RenderCalendarWithContributions').returns({});
    });

    afterEach(() => {
      renderCalendarWithContributionsSpy.restore();
    });

    it('renders the basic calendar with 0 contributions by default', () => {
      const container = '.container';

      Main.processData(container);

      expect(renderCalendarWithContributionsSpy.calledWith(container, BasicCalendar, 0))
        .to.equal(true);
    });
  });
});
