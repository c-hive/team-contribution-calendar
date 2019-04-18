export const getFakeContributionsObjectWithDailyCounts = (
  dailyCounts, dates,
) => dailyCounts.map((count, index) => ({
  children: [
    {
      children: [
        {
          children: [
            {
              attributes: {
                class: 'day',
                'data-count': count,
                'data-date': dates ? dates[index] : '2018-03-18',
                fill: '#ebedf0',
                height: '10',
                width: '10',
                x: '13',
                y: '0',
              },
            },
          ],
        },
      ],
    },
  ],
}));

export const getTestParams = () => ({
  container: '.container',
  gitHubUsers: ['gitHubUsername'],
  gitLabUsers: ['gitLabUsername_one', 'gitLabUsername_one'],
  proxyServerUrl: 'https://proxy-server.com/',
});
