---
layout: page
title: 博客
permalink: /blog
---

{% if site.posts.size > 0%}
	{% assign posts = site.posts %}
	{% include option/post-list.html %}
{% else %}
	{% include config/warnings.html %}
{% endif %}