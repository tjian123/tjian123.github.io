---
layout: page
title: 分类
permalink: /categories
---

{% if site.categories.size > 0 %}
<div class="offset-left">
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
		<h6>该分类下尚无文章 - 这种情况应该不可能出现！</h6>
		{% endif %}
	</div>
	{% endfor %}
</div>
{% else %}
{% include config/warnings.html %}
{% endif %}
