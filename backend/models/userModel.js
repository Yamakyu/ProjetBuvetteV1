const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const userSchema = sequelize.define(
    "users",
    {
      id: {
        field: "user_id",
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      login: {
        field: "login",
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        field: "password",
        type: Sequelize.STRING,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING,
        field: "nom",
        allowNull: true,
      },
      prenom: {
        type: Sequelize.STRING,
        field: "prenom",
        allowNull: true,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        field: "is_admin",
        defaultValue: false,
      },
      isGerantBuvette: {
        type: Sequelize.BOOLEAN,
        field: "is_gerant_buvette",
        defaultValue: false,
      },
      isGerantMateriel: {
        type: Sequelize.BOOLEAN,
        field: "is_gerant_materiel",
        defaultValue: false,
      },
    },

    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );

  userSchema.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
  };
  return userSchema;
};

//Tutos for
//One to many https://bezkoder.com/sequelize-associate-one-to-many/
//Many to many https://bezkoder.com/sequelize-associate-many-to-many/
