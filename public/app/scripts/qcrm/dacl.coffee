angular.module('qcrm')
.factory('dacl', ['User', 'ACL', 'Role', 'RoleMapping', 'Scope', (User, ACL, Role, RoleMapping, Scope) ->
    return {

    getRoles: () ->
      return Role.find()

    getPermissions: () ->
      return ACL.find()

    # set role of user
    # @param user [User]
    # @param role [Role]
    setRole: (user, role) ->
      if 'string' == typeof role
        role = Role.findOne(name: role)
        role.$promise.then (r) ->
          RoleMapping.upsert(
            role: r
            principalType: 'USER'
            principalId: user.id
          )
      else
        RoleMapping.upsert(
          role: role
          principalType: 'USER'
          principalId: user.id
        )


    allowForRole: (role, model, action) ->
      ACL.create({
        model: model,
        property: action || '*',
        permition: 'ALLOW',
        accessType: '*',
        principalType: 'ROLE',
        principalId: role.name
      })

    denyForRole: (role, model, action) ->
      ACL.create({
        model: model,
        property: action || '*',
        permition: 'DENY',
        accessType: '*',
        principalType: 'ROLE',
        principalId: role.name
      })

    allowForUser: (user, model, action) ->
      ACL.create({
        model: model,
        property: action || '*',
        permition: 'ALLOW',
        accessType: '*',
        principalType: 'USER',
        principalId: user.id
      })

    denyForUser: (user, model, action) ->
      ACL.create({
        model: model,
        property: action || '*',
        permition: 'DENY',
        accessType: '*',
        principalType: 'USER',
        principalId: user.id
      })

    can: (role, model, action) ->

    }


  ])
