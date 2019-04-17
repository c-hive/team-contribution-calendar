import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';

export const processParams = async (container, proxyServerUrl, gitHubUsers) => {
  const teamContributionCalendar = new TeamContributionCalendar(
    container, proxyServerUrl, gitHubUsers,
  );

  await teamContributionCalendar.renderBasicAppearance();
};
