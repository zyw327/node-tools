const mongodb = require("mongodb").MongoClient;
const mongo = require("mongodb");
const mongoConfig = {
    host: "localhost1",
    user: "admin",
    password: "123456",
    port: "27017",
    db: "db",
    type: 'mongodb',
    mode: 'set',
    isMain: false,
    host2: 'localhost2',
    port2: '27017',
    setName: 'mgset-28319061',
};

class Mongo {
  constructor() {
    this.mongoClient = null;
  }

  static getInstance() {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo();
    }
    return Mongo.instance;
  }

  init() {
    return new Promise((resolve, reject) => {
      let connectUrl = this.getMongoUri(mongoConfig, false);
      mongodb.connect(connectUrl, (err, mongoClient) => {
        if (err) {
          return reject(err);
        }
        return resolve(mongoClient.db(mongoConfig.db));
      });
    });
  }

  async getClient() {
    if (this.mongnClient == null) {
      let connectUrl = this.getMongoUri(mongoConfig, false);
      this.mongnClient = await mongodb.connect(connectUrl);
    }
    return this.mongnClient.db(mongoConfig.db);
  }

  /**
   * 封装URI
   * @param {*} config 
   * @param {*} haveCA 
   */
  getMongoUri (config, haveCA) {
    let namePart = '';
    let hostPart;
    let setPostFix = '';
    const username = config.username;
    let password = config.password;
    if (username && password) {
      namePart = `${username}:${password}@`;
    }
    hostPart = `${config.host}:${config.port}`;
    if (config.mode === 'set') {
      for (let i = 0; i < config.clusterNum; i ++) {
        if (config[`host${i}`] && config[`port${i}`]) {
          hostPart += `,${config['host' + i]}:${config['port' + i]}`;
        }
      }    
      setPostFix = `?replicaSet=${config.setName}`;
    }
    if (haveCA) {
      if (!setPostFix) setPostFix = '?';
      else setPostFix += '&';
      setPostFix += 'ssl=true';
    }
    const mongoUri = `mongodb://${namePart}${hostPart}/${config.db}${setPostFix}`;
    return mongoUri;
  }

  /**
   * 获取集合
   * @param {*} collectionName 
   */
  async getCollection(collectionName) {
    let db = await this.init();
    return db.collection(collectionName);
  }

  /**
   * 分页查找
   * @param {*} collectionName 
   * @param {*} page 
   * @param {*} pagesize 
   */
  async find(collectionName, page, pagesize) {
    let collection = await this.getCollection(collectionName)
    return await collection.find().limit(pagesize).skip( (page - 1) * pagesize ).toArray();
  }
  
  /**
   * 查找所有
   * @param {*} collectionName 
   * @param {*} where 
   */
  async findAll(collectionName, where) {
    let collection = await this.getCollection(collectionName);
    return await collection.find(where).toArray();
  }

  /**
   * 统计条目
   * @param {*} collectionName 
   * @param {*} where 
   */
  async countAll(collectionName, where) {
    let collection = await this.getCollection(collectionName);
    return await collection.count(where);
  }

  /**
   * 更新
   * @param {*} collectionName 
   * @param {*} where 
   * @param {*} set 
   */
  async update(collectionName, where, set) {
    let collection = await this.getCollection(collectionName)
    return await collection.updateOne(where, {$set: set});
  }

  /**
   * 部分更改
   * @param {*} collectionName 
   * @param {*} where 
   * @param {*} pull 
   */
  async updatePull(collectionName, where, pull) {
    let collection = await this.getCollection(collectionName)
    return await collection.updateOne(where, {$pull: pull});
  }

  /**
   * 新增
   * @param {*} collectionName 
   * @param {*} data 
   */
  async insert(collectionName, data) {
    let collection = await this.getCollection(collectionName);		
    return await collection.insert(data);
  }

  /**
   * 获取objectId
   * @param {*} objectId 
   */
  getObjectId(objectId) {
    return mongo.ObjectId(objectId);
  }

  /**
   * 关闭连接
   */
  async close() {
    if (!this.mongnClient) {
        return ;
    }
    await this.mongnClient.close();
  }
}

module.exports = new Mongo();
