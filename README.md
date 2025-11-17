# ReserWeb
Aplicacion sobre reservas web para hotel

## Funcionalidades y/o requisitos:

### Registro e inicio de sesión

RF1. El sistema debe permitir a los clientes registrar una nueva cuenta ingresando datos personales (cédula, nacionalidad, nombre completo, tipo de documento, correo).

RF2. El sistema debe validar que el cliente no esté ya registrado antes de permitir la creación de una nueva cuenta.

RF3. El sistema debe permitir a los clientes iniciar sesión con su correo y contraseña.

### Gestión de usuario

RF4. El cliente debe poder modificar algunos de sus datos personales una vez haya iniciado sesión.

RF5. El administrador debe poder visualizar los datos personales de cualquier cliente registrado siguiendo el tratamiento de datos.

### Gestión de habitaciones

RF6. El sistema debe permitir a los clientes buscar habitaciones según numero de personas (adultos y niños) y numero de habitaciones.

RF7. El sistema debe permitir visualizar la disponibilidad de las habitaciones por fechas.

RF8. El sistema debe mostrar las características específicas de cada habitación (Wi-Fi, baño privado o compartido, calefacción, TV, vista a la montaña, etc.).

### Gestión de servicios adicionales

RF9. El sistema debe permitir que el cliente seleccione servicios adicionales con costo extra: desayuno, tour al páramo de Ocetá, recorrido turístico por el pueblo, o las que considere el administrador del hotel.

### Reservas

RF10. El sistema debe permitir al cliente reservar habitaciones seleccionadas según fechas y cantidad de personas.

RF11. El sistema debe calcular el costo total de la reserva, cobrando por persona por noche, y sumando los servicios adicionales seleccionados.

### Administración y control

RF12. El administrador debe poder consultar todas las reservas realizadas.

RF13. El administrador debe poder ver un resumen de la ocupación por fechas.

RF14. El administrador o cliente debe poder cancelar una reserva bajo ciertas condiciones (por definir en reglas de negocio).

# Lenguajes

* Tailwind(CSS)
* React(JSX)
* JavaScript (JS)

# DevMode Local
* Es requisito tener insatalado Node.js
* Instalar npm
* Instalar librerias->npm install
* Correr Prueba->npm run dev 
