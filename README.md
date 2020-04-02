# Team contribution calendar

#### GitHub-like contribution calendar for the whole team. Supports GitHub and GitLab.

![](etc/preview.gif)

Status and support

- &#x2714; stable
- &#x2714; supported
- &#x2714; ongoing development

<!--- Version information -->
*You are viewing the README of version [v0.2.0](/../../releases/tag/v0.2.0). You can find other releases [here](/../../releases).*
<!--- Version information end -->

 [![Build Status](https://github.com/c-hive/team-contribution-calendar/workflows/CI/badge.svg)](https://github.com/c-hive/team-contribution-calendar/actions)
[![Coverage Status](https://coveralls.io/repos/github/c-hive/team-contribution-calendar/badge.svg?branch=master)](https://coveralls.io/github/c-hive/team-contribution-calendar?branch=master)
[![npm version](https://badge.fury.io/js/%40c-hive%2Fteam-contribution-calendar.svg)](https://badge.fury.io/js/%40c-hive%2Fteam-contribution-calendar)
[![Total Downloads](https://img.shields.io/npm/dw/@c-hive/team-contribution-calendar.svg)](https://www.npmjs.com/package/@c-hive/team-contribution-calendar)

### Usage

#### As dependency

```
yarn add @c-hive/team-contribution-calendar
```

We recommend using `yarn` because of [compatibility](https://github.com/c-hive/team-contribution-calendar/issues/55).

#### Via CDN

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/c-hive/team-contribution-calendar@0.2.0/dist/team-contribution-calendar.min.js">
</script>
```

#### Config

<pre>
<b>TeamContributionCalendar(container, gitHubUsers, gitLabUsers, proxyServerUrl)</b>
</pre>

- `container`: a DOM element in which the calendar will be rendered
- `gitHubUsers` / `gitLabUsers`: array of users
  - both of them should be defined even if they're empty
  - optionally specify the starting point of the timeframe
  - accepted formats
    - `["tenderlove"]`
    - `
    - `[{ name: "tenderlove", from: "2020-01-01" }]`
  - (optional: you can give timeframe to a user for example: `["tenderlove", ['2020-01-01','2020-03-01']]`)
- `proxyServerUrl`: CORS proxy url
  - We serve one by default for _development purposes only_, no uptime guaranteed. Consider using your [own server](https://github.com/c-hive/cors-proxy). Keep it in mind, **otherwise you will most likely get 403 on production**.

#### Examples

##### As dependency

```javascript
import TeamContributionCalendar from "@c-hive/team-contribution-calendar";

const container = document.getElementById("container");
const ghUsernames = ["tenderlove", "gaearon"];
const glUsernames = ["sytses", "gnachman"];

TeamContributionCalendar(container, ghUsernames, glUsernames, "https://your-proxy-server.com/");
```

##### Via CDN

```html
<div class="container"></div>
<script>
   const ghUsernames = ["tenderlove", "gaearon"];
   const glUsernames = ["sytses", "gnachman"];
   TeamContributionCalendar(".container", ghUsernames, glUsernames, "https://your-proxy-server.com/");
</script>
```

## Contribution and feedback

This project is built around known use-cases. If have one that isn't covered don't hesitate to open an issue and start a discussion.

Bug reports and pull requests are welcome on GitHub at https://github.com/c-hive/team-contribution-calendar. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Conventions

This project follows [C-Hive guides](https://github.com/c-hive/guides) for code style, way of working and other development concerns.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
