'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Users', [
      {
        email: 'christopherjoon@gmail.com',
        username: 'chrisjoonlee',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'smack@my.ass',
        username: 'cupcakke',
        hashedPassword: bcrypt.hashSync('yespapi')
      },
      {
        email: 'meicidou@shang.zhuang',
        username: 'jiafei',
        hashedPassword: bcrypt.hashSync('yehuaxiang')
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['chrisjoonlee, cupcakke, jiafei'] }
    });
  }
};
