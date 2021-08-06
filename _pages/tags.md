---
layout: banner-page
navEnabled: true
title: 标签
description: 每一篇文章都该有其思想，正如每一个人都应有其性格 —— 贴几个标签，让你的文章旗帜鲜明！
permalink: /tags
---

{% if site.tags.size > 0%}
	{% assign tags = site.tags %}
	{% include option/tag-list.html %}
{% else %}
	{% include config/warnings.html %}
{% endif %}