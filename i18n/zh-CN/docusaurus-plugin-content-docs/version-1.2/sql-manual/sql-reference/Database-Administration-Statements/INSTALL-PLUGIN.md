---
{
    "title": "INSTALL-PLUGIN",
    "language": "zh-CN"
}
---

## INSTALL-PLUGIN

### Name

INSTALL PLUGIN

## 描述

该语句用于安装一个插件。

语法：

```sql
INSTALL PLUGIN FROM [source] [PROPERTIES ("key"="value", ...)]
```

source 支持三种类型：

1. 指向一个 zip 文件的绝对路径。
2. 指向一个插件目录的绝对路径。
3. 指向一个 http 或 https 协议的 zip 文件下载路径

## 举例

1. 安装一个本地 zip 文件插件：

    ```sql
    INSTALL PLUGIN FROM "/home/users/doris/auditdemo.zip";
    ```

2. 安装一个本地目录中的插件：

    ```sql
    INSTALL PLUGIN FROM "/home/users/doris/auditdemo/";
    ```

3. 下载并安装一个插件：

    ```sql
    INSTALL PLUGIN FROM "http://mywebsite.com/plugin.zip";
    ```

    注意需要放置一个和 `.zip` 文件同名的 md5 文件, 如 `http://mywebsite.com/plugin.zip.md5` 。其中内容为 .zip 文件的 MD5 值。

4. 下载并安装一个插件,同时设置了zip文件的md5sum的值：

    ```sql
    INSTALL PLUGIN FROM "http://mywebsite.com/plugin.zip" PROPERTIES("md5sum" = "73877f6029216f4314d712086a146570");
    ```

### Keywords

    INSTALL, PLUGIN

### Best Practice

