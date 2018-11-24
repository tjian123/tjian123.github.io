---
layout: defaultPage
navEnabled: true
title: 分类
permalink: /categories
---

{% if site.categories.size > 0%}
	{% assign categories = site.categories %}
	{% include option/category-list.html %}
{% else %}
	{% include config/warnings.html %}
{% endif %}
