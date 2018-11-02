---
layout: post
title: YAML基本用法
categories: [Coding]
tags: [YAML]
---

> YAML - Ain't Markup Language.

参考链接：<http://www.yaml.org/>

### 在`requirements.txt`文件声明yaml库依赖

```
## Python requirements for using the grpc_onos_device application.
##
##    pip install --requirement=requirements.txt
##
PyYAML>=3.11
```

### 创建yml文件

```
name: Jacky Smith
age: 36
spouse:
  name: Micky
  age: 25
children:
  - name: Jim Smith
    age: 6
  - name: Lucy Smith
    age: 5
```

### 测试代码

```
""" This is used to test yaml.

"""

from yaml import load, dump


def main():
    config = load(file("etc/config.yml", 'r'))
    print config
    print config["name"]
    print config["children"][0]["name"]
    info = dump(config)
    print info

if __name__ == '__main__':
    main()
```

### 输出

```
{'age': 36, 'spouse': {'age': 25, 'name': 'Micky'}, 'name': 'Jacky Smith', 'children': [{'age': 6, 'name': 'Jim Smith'}, {'age': 5, 'name': 'Lucy Smith'}]}
Jacky Smith
Jim Smith
age: 36
children:
- {age: 6, name: Jim Smith}
- {age: 5, name: Lucy Smith}
name: Jacky Smith
spouse: {age: 25, name: Micky}
```