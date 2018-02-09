---
layout: page
title: 分类
permalink: /categories
---

<div class="offset-left">
{% if site.categories.size > 0 %}
<div class="fixed-left" id="archs">
<ul class="fixed-left-list">
{% for category in site.categories %}
<li class="fixed-left-list-item"><a class="" href="#category-{{ category | first }}">{{ category | first }}</a></li>
{% endfor %}
</ul>
</div>

{% for category in site.categories %}
<div class="collapse-base collapse-item-inactive" id="category-{{ category | first }}">
	{% if category[1].size > 0 %}
	{% assign posts = category[1] %}
	{% include option/posts-list.html %}
	{% else %}
	<h6>尚无页面！</h6>
	{% endif %}
</div>
{% endfor %}
{% endif %}
</div>
