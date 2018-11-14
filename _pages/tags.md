---
layout: page
title: 标签
description: 每一篇文章都该有其思想，正如每一个人都应有其性格 —— 贴几个标签，让你的文章旗帜鲜明！
permalink: /tags
---


<main class="site-tag">
	{% if site.tags.size > 0 %}	
	<ul class="tag-list">
	{% for tag in site.tags %}
		<li class="tag-list-item">
			<h4 class="post-tag" id="tag-{{ tag | first }}">{{ tag | first }}</h4>
			<ol class="post-list">
			{% for post in tag[1] %}
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