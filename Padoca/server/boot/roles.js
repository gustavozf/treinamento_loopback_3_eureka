module.exports = function(app) {
  const { Role, RoleMapping } = app.models;

  Role.findOrCreate({ name: "lojista" });
  Role.findOrCreate({ name: "cliente" });
  Role.findOrCreate({ name: "admin" });

  RoleMapping.findOrCreate({
    principalType: RoleMapping.USER,
    principalId: 1,
    roleId: 3
  });
};
