## Python读取参数

### 常用API

    import argparse
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('--file_name', 
                        help='help, description',
                        type=str,
                        action='store',
                        required=True)