import Calendar from '../resources/Calendar/Calendar';

export const processParams = async (container, proxyServerUrl) => {
  const calendar = new Calendar(container, proxyServerUrl);

  await calendar.renderBasicAppearance();
};
