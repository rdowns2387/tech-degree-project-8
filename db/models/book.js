const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A Title is required.'
        },
        notEmpty: {
          msg: 'A Title is required.'
        }
      },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An Author is required.'
        },
        notEmpty: {
          msg: 'An Author is required.'
        }
      },
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, { sequelize}); //same as {sequelize: sequelize}

  return Book;
};
