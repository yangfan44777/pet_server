PetsServer
==========

#### 启动 mongodb

``` bash
mongod --config /usr/local/etc/mongod.conf
```

#### 启动 node 服务
``` bash
node bin/www
```

##API说明

####/profile/recommend/detail

两种分页方式:

1. `API` + ?ort={0|1}&sid={string}&limit={number}

    字段说明：
    
    ort: 刷新方式, `0`为上刷新, `1`为下刷新
    
    sid: 从哪个`排序字段`开始, 这里User的`_id`
    
    limit: 如果是下刷新, 限制取几条, 上刷新忽略该字段
        
2.  `API` + ?offset={number}&limit={number}

    字段说明：
    
    offset: 传统刷新方式的`第几页`
    
    limit: 传统刷新方式`每页出多少条`
    
####/profile/fans/detail/:userid

两种分页方式:

1. `API` + ?ort={0|1}&sid={string}&limit={number}

    字段说明：
    
    ort: 刷新方式, `0`为上刷新, `1`为下刷新
    
    sid: 从哪个`排序字段`开始, 这里是`:userid`对应的`followed数组`的元素值
    
    limit: 如果是下刷新, 限制取几条, 上刷新忽略该字段
        
2.  `API` + ?offset={number}&limit={number}

    字段说明：
    
    offset: 传统刷新方式的`第几页`
    
    limit: 传统刷新方式`每页出多少条`
    
####/profile/follows/detail/:userid

两种分页方式:

1. `API` + ?ort={0|1}&sid={string}&limit={number}

    字段说明：
    
    ort: 刷新方式, `0`为上刷新, `1`为下刷新
    
    sid: 从哪个`排序字段`开始, 这里是`:userid`对应的`follows数组`的元素值
    
    limit: 如果是下刷新, 限制取几条, 上刷新忽略该字段
        
2.  `API` + ?offset={number}&limit={number}

    字段说明：
    
    offset: 传统刷新方式的`第几页`
    
    limit: 传统刷新方式`每页出多少条`
    
####/profile/feeds/:userid

两种分页方式:

1. `API` + ?ort={0|1}&sid={string}&limit={number}

    字段说明：
    
    ort: 刷新方式, `0`为上刷新, `1`为下刷新
    
    sid: 从哪个`排序字段`开始, 这里是Feed的`_id`
    
    limit: 如果是下刷新, 限制取几条, 上刷新忽略该字段
        
2.  `API` + ?offset={number}&limit={number}

    字段说明：
    
    offset: 传统刷新方式的`第几页`
    
    limit: 传统刷新方式`每页出多少条`
    
