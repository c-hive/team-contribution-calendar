# Team contribution calendar

#### GitHub-like contribution calendar for the whole team. Supports GitHub and GitLab.

![](etc/preview.gif)

Status and support

- &#x2716; work in progress
- &#x2714; supported
- &#x2714; ongoing development

### Usage

Include the CDN in the desired file.
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/c-hive/team-contribution-calendar/dist/team-contribution-calendar.min.js">
</script>
```

#### Config

<pre>
<b>TeamContributionCalendar(container, gitHubUsers, gitLabUsers, proxyServerUrl)</b>
</pre>
    	
Required params:
- `container`: a DOM element in which the calendar will be rendered,
- `gitHubUsers`: array of GitHub usernames(at least one).

Optional params:
- `gitLabUsers`: array of GitLab usernames,
- `proxyServerUrl`: CORS proxy url(we serve one by default).

The function can be called likewise the examples below.

```html
<div class="container"></div>
<script>
   // Without the optional params.
   TeamContributionCalendar('.container', ['gh_username']);
</script>
```

```html
<div class="container"></div>
<script>
   // With both the required and optional params.
   TeamContributionCalendar('.container', ['gh_username_one', 'gh_username_two'], ['gl_username'], 'https://proxy-server-url.com');
</script>
```
