---
layout: page
title: 标签
permalink: /tags
---

<div class="dynamic-content">
{% if site.tags.size > 0 %}
<div class="dynamic-content-header" id="archs">
<ul class="dynamic-content-list">
{% for tag in site.tags %}
<li class="dynamic-content-list-item"><a class="" href="#tag-{{ tag | first }}">{{ tag | first }}/{{ tag | last | size}}</a></li>
{% endfor %}
</ul>
</div>

{% for tag in site.tags %}
<div class="collapse-base collapse-item-inactive" id="tag-{{ tag | first }}">
	{% if tag[1].size > 0 %}
	{% assign posts = tag[1] %}
	{% include option/posts-list.html %}
	{% else %}
	<h6>尚无页面！</h6>
	{% endif %}
</div>
{% endfor %}
{% endif %}
</div>