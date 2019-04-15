import BasicCalendar from '../BasicCalendar/BasicCalendar.json';

export class State {
  constructor() {
    this.actualCalendar = BasicCalendar;
    this.totalContributions = 0;
    this.isLoading = true;
  }

  setState(data) {
    const { currentUserTotalContributions, updatedActualCalendar } = data;

    this.actualCalendar = {
      ...updatedActualCalendar,
    };

    this.totalContributions = this.totalContributions + currentUserTotalContributions;
  }
}
