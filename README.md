# Team contribution calendar

#### GitHub-like contribution calendar for the whole team. Supports GitHub and GitLab.

![](etc/preview.gif)

Status and support

- &#x2716; work in progress
- &#x2714; supported
- &#x2714; ongoing development

#### Usage

Include the CDN in the desired file.
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/c-hive/team-contribution-calendar/dist/team-contribution-calendar.min.js">
</script>
```

    	
Required params:
- container: a DOM element in which the calendar will be rendered,
- at least one GitHub user(array).

Optional params:
- GitLab users(array).
- CORS proxy server url(we serve one by default).

The function can be called likewise the examples below.

```html
<div class="container"></div>
<script>
	TeamContributionCalendar('.container', ['gh_usernames']);
</script>
```

```html
<div class="container"></div>
<script>
	TeamContributionCalendar('.container', ['gh_usernames'], ['gl_usernames'], 'https://proxy-server-url.com');
</script>
```