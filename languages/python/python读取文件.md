## Python读取文件

### 常用API
- open(file_path,open_node)

定义测试文件score.txt

    Id Name Score
    1 Li 100
    2 Zh 96
    3 He 60

编写程序，读取文件内容并打印

    #!/bin/env python
    #*-* coding utf-8 *-*
    def main():
        with open("score.txt", "r") as f:
            line = f.readline()            
            s_id, s_name, s_score = line.split()
            print "%s-%s-%s" % (s_id, s_name, s_score)
            for line in f:
                s_id, s_name, s_score = line.split()
                print "%d-%s-%d" % (int(s_id), s_name, int(s_score))
