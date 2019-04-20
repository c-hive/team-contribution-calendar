import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';

export const processParams = async (container, gitHubUsers, gitLabUsers, proxyServerUrl) => {
  const teamContributionCalendar = new TeamContributionCalendar(
    container, gitHubUsers, gitLabUsers, proxyServerUrl,
  );

  await teamContributionCalendar.renderBasicAppearance();

  teamContributionCalendar.aggregateUserCalendars();
};
