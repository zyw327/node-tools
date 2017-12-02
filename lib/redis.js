const redis = require("redis");
const configs = {
    host: "127.0.0.1",
    port: 6379,
    db:1,
    password: 123456
};

class Redis {
    constructor() {
        this.redisClient = redis.createClient({
            host: configs.host,
            port: configs.port,
            password: configs.password,
            db: configs.db
        });
    }

    /**
     * 选定redis的分片
     * @param {*} db 
     */
    select(db) {
        return new Promise((resolve, reject) => {
            this.redisClient.select(db, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    /**
     * 获取键的过期时间，不存在返回-2，未指定过期时间返回-1，否则返回指定的过期时间，单位毫秒
     * @param {*} key 
     */
    ttl(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.ttl(key, (err, time) => {
                if (err) {
                    return reject(err);
                }
                return resolve(time);
            });
        });
    }

    /**
     * 设置键值并指定过期时间
     * @param {*} key 
     * @param {*} value 
     * @param {*} time 
     */
    setex(key, value, time) {
        return new Promise((resolve, reject) => {
            this.redisClient.setex(key, time, value, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    /**
     * 指定键的过期时间
     * @param {*} key 
     * @param {*} time 
     */
    expire(key, time) {
        return new Promise((resolve, reject) => {
            this.redisClient.expire(key, time, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                resolve(reply);
            });
        });
    }

    /**
     * 增加键值，可以指定过期时间
     * @param {*} key 
     * @param {*} value 
     * @param {*} time 
     */
    set(key, value, time) {
        if (time && time > 0) {
            return this.setex(key, value, time);
        }

        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    /**
     * 根据key获取值
     * @param {*} key 
     */
    get(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                resolve(reply);
            });
        });
    }

    /**
     * 获取匹配的指定个数的键
     * @param {*} cursor 
     * @param {*} pattern 
     * @param {*} count 
     */
    async scan(cursor, pattern, count) {
        return new Promise((resolve, reject) => {
            try {
                this.redisClient.scan(cursor, 'MATCH', pattern, "COUNT", count, (err, reply) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(reply);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取所有匹配的键
     * @param {*} pattern 
     */
    async scanAll(pattern) {
        try {
            let count = 10;
            const found = [];
            let cursor = "0";
            do {
                let reply = await this.scan(cursor, pattern, count);
                cursor = reply[0];
                found.push(...reply[1]);
            } while (cursor != '0');
            return found;
        } catch (error) {
            reject(error);
        }
    }
    /**
     * 关闭redis连接
     */
    close() {
        return new Promise((resolve, reject) => {
            this.redisClient.quit((err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }
}

module.exports = Redis;