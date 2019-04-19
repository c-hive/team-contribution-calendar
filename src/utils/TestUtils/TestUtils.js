export const getFakeContributionsObjectWithDailyCounts = dailyCounts => dailyCounts.map(count => ({
  children: [
    {
      children: [
        {
          children: [
            {
              attributes: {
                class: 'day',
                'data-count': count,
                'data-date': '2018-03-18',
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
  gitLabUsers: ['gitLabUsername_one', 'gitLabUsername_two'],
  proxyServerUrl: 'https://proxy-server.com/',
});
