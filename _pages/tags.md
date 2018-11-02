---
layout: page
title: 标签
description: 每一篇文章都该有其思想，正如每一个人都应有其性格 —— 贴几个标签，让你的文章旗帜鲜明！
permalink: /tags
---

{% if site.tags.size > 0 %}
<div class="dynamic-content">
	<div class="dynamic-content-header" id="archs">
		<ul class="dynamic-content-list">
			{% for tag in site.tags %}
			<li class="dynamic-content-list-item"><a class="" href="#tag-{{ tag | first }}">{{ tag | first }}({{ tag | last | size}})</a></li>
			{% endfor %}
		</ul>
	</div>
	{% for tag in site.tags %}
	<div class="collapse-base collapse-item-inactive" id="tag-{{ tag | first }}">
		{% if tag[1].size > 0 %}
		{% assign posts = tag[1] %}
		{% include option/posts-list.html %}
		{% else %}
		<h6>该标签下尚无文章 - 这种情况应该不可能出现！</h6>
		{% endif %}
	</div>
	{% endfor %}
</div>
{% else %}
{% include config/warnings.html %}
{% endif %}