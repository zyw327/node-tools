const mysql = require('mysql');
const mysqlConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "12345678",
    port: "3306",
    database: "db"
};
class Mysql {
  constructor() {

  }

  /**
   * 创建连接
   */
  async createConnection() {
    let connection = mysql.createConnection({
      host     : mysqlConfig.host,
      user     : mysqlConfig.user,
      password : mysqlConfig.password,
      database : mysqlConfig.database,
      port: mysqlConfig.port
    });
    connection.connect();
    return connection;
  }

  /**
   * 创建连接池
   */
  async createPool() {
    let pool  = mysql.createPool({
      connectionLimit : 10,
      host     : mysqlConfig.host,
      user     : mysqlConfig.user,
      password : mysqlConfig.password,
      database : mysqlConfig.database,
      port: mysqlConfig.port
    });
    return pool;
  }

  async insert() {
    
  }

  async update() {

  }

  /**
   * sql执行
   * @param {*} sql 
   */
  async query(sql) {
    let pool = await this.createConnection();
    return new Promise((resolve, reject) => {
      pool.query(sql, (error, results, fields) => {
        if (error) {
          pool.destroy();
          return reject(error);
        }
        pool.destroy();
        resolve([results, fields]);
      });
    });
  }
}

module.exports = Mysql;