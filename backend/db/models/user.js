'use strict';
const bcrypt = require('bcryptjs/dist/bcrypt');
const { Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  User.associate = function (models) {
    // associations can be defined here
  };

  // Instance method: Returns an object with only the User instance
  // info that's safe to save to a JWT
  User.prototype.toSafeObject = function () { // Cannot be an arrow functino
    const { id, username, email } = this; // Context is the User instance
    return { id, username, email };
  }

  // Instance method: Returns true if the password matches the User
  // instance's hashedPassword, otherwise returns false
  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  }

  // Static method: Gets a user by id
  User.getCurrentUserById = async function (id) {
    return await User.scope('currentUser').findByPk(id);
  }

  // Static method: Logs in a user
  User.login = async function ({ credential, password }) {
    const { Op } = require('sequelize');

    // Search for user with specified credential
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    // Returns the user if the password is valid
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  }

  // Static method: Signs up a new user
  User.signup = async function ({ username, email, password }) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      username,
      email,
      hashedPassword
    });
    return await User.scope('currentUser').findByPk(user.id);
  }

  return User;
};