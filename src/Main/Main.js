import TeamContributionCalendar from '../resources/TeamContributionCalendar/TeamContributionCalendar';

export const processParams = async (container, proxyServerUrl) => {
  const teamContributionCalendar = new TeamContributionCalendar(container, proxyServerUrl);

  await teamContributionCalendar.renderBasicAppearance();
};
