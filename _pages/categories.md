---
layout: page
title: 分类
permalink: /categories
---

<main class="site-category">
	{% if site.categories.size > 0 %}	
	<ul class="category-list">
	{% for category in site.categories %}
		<li class="category-list-item">
			<h4 class="post-category" id="category-{{ category | first }}">{{ category | first }}</h4>
			<ol class="post-list">
			{% for post in category[1] %}
				<li class="post-list-item">
					<a href="{{ post.url | prepend: site.baseUrl }}">{{ site.title }}</a>
				</li>
			{% endfor%}
			</ol>
		</li>
	{% endfor%}
	</ul>
	{% endif%}
</main>
