module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorials", {
    title: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    published: { type: Sequelize.BOOLEAN },
  });

  return Tutorial;
  //↑ Notre table SQL
};

//Tutos for
//One to many https://bezkoder.com/sequelize-associate-one-to-many/
//Many to many https://bezkoder.com/sequelize-associate-many-to-many/
