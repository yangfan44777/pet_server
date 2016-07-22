PetsServer
==========

#### 启动 mongodb

``` bash
mongod --config /usr/local/etc/mongod.conf
```

#### 启动 node 服务
``` bash
npm install
gulp
cd output
node bin/www
```

##API说明

####有分页功能的api：

    * /profile/recommend/detail
    * /profile/fans/detail/:userid
    * /profile/follows/detail/:userid
    * /profile/feeds/:userid
    * /article/recommend
    * /article/all

####两种分页方式:

1. `API` + ?ort={0|1}&sid={string}&limit={number}

    字段说明：
    
    ort: 刷新方式, `0`为上刷新, `1`为下刷新
    
    sid: 从哪个`排序字段`开始
    
    limit: 如果是下刷新, 限制取几条, 上刷新忽略该字段
    
    ***注: 下刷新返回的数组是较新的在数组尾部, 较旧的在头部***
        
2.  `API` + ?offset={number}&limit={number}

    字段说明：
    
    offset: 传统刷新方式的`第几页`
    
    limit: 传统刷新方式`每页出多少条`

##身份验证

 ![image](https://github.com/yangfan44777/pet_server/raw/master/aut.png)
