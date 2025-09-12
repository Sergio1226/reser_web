# ReserWeb
Aplicacion sobre reservas web para hotel

## Funcionalidades y/o requisitos:

### Registro e inicio de sesión

RF1. El sistema debe permitir a los clientes registrar una nueva cuenta ingresando datos personales (cédula, nacionalidad, nombre completo, profesión, teléfono, tipo de documento, correo).

RF2. El sistema debe validar que el cliente no esté ya registrado antes de permitir la creación de una nueva cuenta.

RF3. El sistema debe permitir a los clientes iniciar sesión con su correo y contraseña.

### Gestión de usuario

RF4. El cliente debe poder modificar sus datos personales (algunos como correo, contraseña, profesión y teléfono) una vez haya iniciado sesión. (Se implementa o no dependiendo el tiempo)

RF5. El administrador debe poder visualizar los datos personales de cualquier cliente registrado siguiendo el tratamiento de datos.

### Gestión de habitaciones

RF6. El sistema debe permitir a los clientes buscar habitaciones según numero de personas (adultos y niños) y numero de habitaciones.

RF7. El sistema debe permitir visualizar la disponibilidad de las habitaciones por fechas.

RF8. El sistema debe mostrar las características específicas de cada habitación (Wi-Fi, baño privado o compartido, calefacción, TV, vista a la montaña, etc.).

RF9. El administrador debe poder añadir nuevas habitaciones al sistema. (Se implementa o no dependiendo el tiempo)

RF10. El administrador debe poder modificar la información de una habitación existente. (Se implementa o no dependiendo el tiempo)

RF11. El administrador debe poder establecer el estado de una habitación como Abierta o Cerrada dentro de un intervalo de fechas.

### Gestión de servicios adicionales

RF12. El sistema debe permitir que el cliente seleccione servicios adicionales con costo extra: desayuno, tour al páramo de Ocetá, recorrido turístico por el pueblo, o las que considere el administrador del hotel.

### Reservas

RF13. El sistema debe permitir al cliente reservar habitaciones seleccionadas según fechas y cantidad de personas.

RF14. El sistema debe calcular el costo total de la reserva, cobrando por persona por noche, y sumando los servicios adicionales seleccionados.

RF15. El sistema debe permitir al cliente seleccionar el método de pago: Efectivo y transferencia bancaria (PSE). (Se implementa o no dependiendo el tiempo)

RF16. El sistema debe requerir el valor total para confirmar la reserva. (Se implementa o no dependiendo el tiempo)

RF17. El sistema debe permitir modificar una reserva existente, ajustando fechas, número de personas, habitación o servicios seleccionados, siempre que haya disponibilidad. (Se implementa o no dependiendo el tiempo)

### Administración y control

RF18. El administrador debe poder consultar todas las reservas realizadas.

RF19. El administrador debe poder ver un resumen de la ocupación por fechas.

RF20. El administrador o cliente debe poder cancelar una reserva bajo ciertas condiciones (por definir en reglas de negocio).

RF21. El sistema debe permitir al administrador eliminar habitaciones que no estén asociadas a reservas activas o futuras. (Se implementa o no dependiendo el tiempo)
