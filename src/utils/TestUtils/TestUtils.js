const getInitialCalendar = () => ({
  children: [
    {
      children: [
        {
          children: []
        }
      ]
    }
  ]
});

const getDailyAttribute = (date, contributions) => ({
  class: "day",
  "data-count": String(contributions),
  "data-date": date,
  fill: "#ebedf0",
  height: "10",
  width: "10",
  x: "13",
  y: "0"
});

export const getFakeContributionsObjectWithDailyCounts = dailyDataWithContributions => {
  const fakeContributionsObjectWithDailyCounts = getInitialCalendar();

  Object.keys(dailyDataWithContributions).forEach(date => {
    fakeContributionsObjectWithDailyCounts.children[0].children[0].children.push(
      {
        attributes: getDailyAttribute(date, dailyDataWithContributions[date])
      }
    );
  });

  return fakeContributionsObjectWithDailyCounts;
};

export const getTestParams = () => ({
  container: ".container",
  gitHubUsers: ["gitHubUsername"],
  gitLabUsers: ["gitLabUsername_one", "gitLabUsername_two"],
  proxyServerUrl: "https://proxy-server.com/"
});
