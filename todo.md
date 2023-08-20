- Validar creación de producto con usuario "Admin" || "Premium" [x] / [x]

- Modificar Schema Product
  - Agregar campo owner: defecto "admin" sino mail de usuario "premium" (solo pueden crear esos dos) [x] / [x]

- Implementar nueva ruta /api/users/premium/:uid, la cual permite cambiar el rol de usuario "user" a "premium", y viceversa [x] / [x]

- Usuario premium sólo puede borrar/actualizar productos creados por el. Validar con campo owner [x] / [x]

- Validar que un usuario premium NO pueda agregar al carrito, productos creados por el [x] / [X]

- middleware que valide que si el usuario es administrador en las rutas de crear, modificar y eliminar un producto.Simplemente seria agregar otro middleware despues del de password y obtener el campo role del usuario validando si el mismo es o no admin. [x] / []

- El dto de productos debería tener el id [x] / [x]

- Como único detalle, le agregaría al ticket el conjunto de productos para tener este resumen en la base de datos de alguna manera. [] / []

- Refactor purchase [] / []

- Sistema recuperación contraseña con link que expira en 1h [] / []