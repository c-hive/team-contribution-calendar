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

export const getInitialCalendarWithTextFill = () => {
  return {
    children: [
      {
        children: [
          {
            name: "text",
            type: "element",
            value: "",
            attributes: {
              "text-anchor": "start",
              class: "wday",
              fill: "#767676",
              dx: "-10",
              dy: "81",
              style: "display: none;"
            },
            children: [
              {
                name: "",
                type: "text",
                value: "Sat",
                attributes: {},
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
};

const getDailyAttribute = (date, contributions) => ({
  class: "day",
  "data-count": String(contributions),
  "data-date": date,
  fill: "#000000",
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
