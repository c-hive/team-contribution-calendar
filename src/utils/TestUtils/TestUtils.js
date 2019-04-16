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

export const getStateFakeParams = () => ({
  container: '.container',
  proxyServerUrl: 'https://proxy-server.com',
  gitHubUsers: ['userName_one', 'userName_two'],
});
