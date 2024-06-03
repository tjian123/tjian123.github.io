---
layout: page
navEnabled: true
title: 书籍
permalink: /mark
---

<ul>
{% for books_hash in site.data.books %}
{% assign books = books_hash[1] %}
    <li>
    {{ books.description }}
        <ul>
        {% for book in books.books %}
            <li>{{ book.name | prepend: "《" | append: "》 - " | append: book.description }}</li>
        {% endfor%}
        </ul>
    </li>
{% endfor %}
</ul>
