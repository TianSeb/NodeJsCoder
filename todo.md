- Ruta Current ¿? (es la ruta del user revisar entrega anterior) []
- Implementar en carts /:cid/purchase [x]
  - finaliza proceso de compra del carrito []
  - Corroborar stock al finalizar compra []
  - Restar si hay stock, sino tiene no agregar al proceso de compra []
  
  - Finalizar este proceso genera un Ticket de compra []
    - Crear clase Ticket y Schema []
    Id (autogenerado por mongo)
    code: String debe autogenerarse y ser único
    purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
    amount: Number, total de la compra.
    purchaser: String, contendrá el correo del usuario asociado al carrito.

    - Al completar la compra, vaciar carro []