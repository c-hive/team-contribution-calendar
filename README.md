# Team contribution calendar

#### GitHub-like contribution calendar for the whole team. Supports GitHub and GitLab.

![](etc/preview.gif)

Status and support

- &#x2714; stable
- &#x2714; supported
- &#x2714; ongoing development

<!--- Version information -->
*You are viewing the README of the development version. You can find the README of the latest release (v0.2.0) [here](https://github.com/c-hive/team-contribution-calendar/releases/tag/v0.2.0).*
<!--- Version information end -->

| Branch | Status |
| ------ | ------ |
| Release | [![Build Status](https://travis-ci.org/c-hive/team-contribution-calendar.svg?branch=release)](https://travis-ci.org/c-hive/team-contribution-calendar)   [![Coverage Status](https://coveralls.io/repos/github/c-hive/team-contributio-calendar/badge.svg?branch=release)](https://coveralls.io/github/c-hive/team-contribution-calendar?branch=release)   [![npm version](https://badge.fury.io/js/%40c-hive%2Fteam-contribution-calendar.svg)](https://badge.fury.io/js/%40c-hive%2Fteam-contribution-calendar)   [![Total Downloads](https://img.shields.io/npm/dw/@c-hive/team-contribution-calendar.svg)](https://www.npmjs.com/package/@c-hive/team-contribution-calendar) |
| Development | [![Build Status](https://travis-ci.org/c-hive/team-contribution-calendar.svg?branch=master)](https://travis-ci.org/c-hive/team-contribution-calendar)   [![Coverage Status](https://coveralls.io/repos/github/c-hive/team-contribution-calendar/badge.svg?branch=master)](https://coveralls.io/github/c-hive/team-contribution-calendar?branch=master) |

### Usage

#### NPM

```
npm install --save @c-hive/team-contribution-calendar
```

#### CDN


```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/c-hive/team-contribution-calendar/release@0.2.0/dist/team-contribution-calendar.min.js">
</script>
```

#### Config

<pre>
<b>TeamContributionCalendar(container, gitHubUsers, gitLabUsers, proxyServerUrl)</b>
</pre>

Required params:
- `container`: a DOM element in which the calendar will be rendered,
- `gitHubUsers` / `gitLabUsers`: array of users(at least one user should be presented in either of them).

Optional param:
- `proxyServerUrl`: CORS proxy url(we serve one by default).

#### Examples

##### NPM

```javascript
import TeamContributionCalendar from "@c-hive/team-contribution-calendar";

const container = document.getElementById('container');

// For further examples, see the CDN section below.
TeamContributionCalendar(container, ['gh_username'], []);
```

##### CDN

```html
<div class="container"></div>
<script>
   // Empty GitLab users, without the optional param.
   TeamContributionCalendar('.container', ['gh_username']);
</script>
```

```html
<div class="container"></div>
<script>
   // Empty GitHub users, without the optional param.
   TeamContributionCalendar('.container', [], ['gl_username_one', 'gl_username_two']);
</script>
```

```html
<div class="container"></div>
<script>
   // Passing both GitHub and GitLab users along with a cors-proxy url.
   TeamContributionCalendar('.container', ['gh_username_one', 'gh_username_two'], ['gl_username'], 'https://proxy-server-url.com');
</script>
```

## Contribution and feedback

This project is built around known use-cases. If have one that isn't covered don't hesitate to open an issue and start a discussion.

Bug reports and pull requests are welcome on GitHub at https://github.com/c-hive/team-contribution-calendar. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Conventions

This project follows [C-Hive guides](https://github.com/c-hive/guides) for code style, way of working and other development concerns.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
