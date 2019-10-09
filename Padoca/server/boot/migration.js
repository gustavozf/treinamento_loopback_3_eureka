const lbTables = [
  "User",
  "AccessToken",
  "ACL",
  "RoleMapping",
  "Role",
  "Produto",
  "Lojista",
  "Cliente"
];

module.exports = function(app) {
  if (lbTables) {
    app.dataSources.padoca.autoupdate(lbTables, function(err) {
      if (err) throw err;

      console.log("Models created!\n");
    });
  }
};
