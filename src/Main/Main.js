import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';

export const processParams = async (container, gitHubUsers, proxyServerUrl) => {
  const teamContributionCalendar = new TeamContributionCalendar(
    container, gitHubUsers, proxyServerUrl,
  );

  await teamContributionCalendar.renderBasicAppearance();

  teamContributionCalendar.aggregateUserCalendars();
};
