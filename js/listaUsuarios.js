document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarControl(e, 10, 10);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
    });

    document.getElementById("btnAceptar").addEventListener("click", e => {
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");

        validarFormulario(txtNombre, txtContrasenia, txtContrasenia2, txtEmail, txtTel, e);

        // Si el formulario es válido, guardamos los cambios
        if (e.target.form.checkValidity()) {
            guardarCambios();
        }
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        let operacion = e.relatedTarget.innerText;

        document.querySelector("#mdlRegistro .modal-title").innerText = operacion;

        if (operacion == 'Editar') {
            
            document.getElementById("txtPassword").disabled = true;
            document.getElementById("txtConfirmarPassword").disabled = true;
        } else {
            document.getElementById("txtPassword").disabled = false;
            document.getElementById("txtConfirmarPassword").disabled = false;
        }
        document.getElementById("txtNombre").focus();
    });
});

function revisarControl(e, min, max) {
    let txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min || txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = '';

    for (var i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let fila = document.createElement("tr");

        let celda = document.createElement("td");
        celda.innerHTML = `<a href="#" data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="${usuario.correo}" onclick="editar(${i})">${usuario.nombre}</a>`;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        tbody.appendChild(fila);
    }
}

function editar(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios[index];

    document.getElementById("txtNombre").value = usuario.nombre;
    document.getElementById("txtEmail").value = usuario.correo;
    document.getElementById("txtTelefono").value = usuario.telefono;
    

    document.querySelector("#mdlRegistro .modal-title").innerText = 'Editar';
    document.getElementById("txtPassword").disabled = true;
    document.getElementById("txtConfirmarPassword").disabled = true;

    // Guardar el índice del usuario que estamos editando en un campo oculto
    document.getElementById("txtIndex").value = index;
}

function validarFormulario(txtNombre, txtContrasenia, txtContrasenia2, txtEmail, txtTel, e) {
    txtNombre.setCustomValidity("");
    txtContrasenia.setCustomValidity("");
    txtContrasenia2.setCustomValidity("");
    txtEmail.setCustomValidity("");
    txtTel.setCustomValidity("");

    if (txtNombre.value.trim().length < 2 || txtNombre.value.trim().length > 60) {
        txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
    }
    if (txtContrasenia.value.trim().length < 6 || txtContrasenia.value.trim().length > 20) {
        txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres)");
    }
    if (txtContrasenia2.value.trim().length < 6 || txtContrasenia2.value.trim().length > 20) {
        txtContrasenia2.setCustomValidity("Confirma la contraseña");
    }
    if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
        txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
    }

    if (!e.target.form.checkValidity()) {
        e.preventDefault();
    }
}



function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [{
            nombre: 'Uriel Perez Gomez',
            correo: 'uriel@gmail.com',
            password: '123456',
            telefono: ''
        }, {
            nombre: 'Lorena Garcia Hernandez',
            correo: 'lorena@gmail.com',
            password: '567890',
            telefono: '4454577468'
        }];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function guardarCambios() {
    let index = document.getElementById("txtIndex").value;
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Comprobar si se está editando o agregando un usuario
    if (index === "") { // Si no hay un índice definido, estamos agregando un nuevo usuario
        let nuevoUsuario = {
            nombre: document.getElementById("txtNombre").value,
            correo: document.getElementById("txtEmail").value,
            telefono: document.getElementById("txtTelefono").value
        };
        usuarios.push(nuevoUsuario); // Agregar el nuevo usuario al final del arreglo
    } else { // Si hay un índice definido, estamos editando un usuario existente
        // Actualizar los datos del usuario existente
        usuarios[index].nombre = document.getElementById("txtNombre").value;
        usuarios[index].correo = document.getElementById("txtEmail").value;
        usuarios[index].telefono = document.getElementById("txtTelefono").value;
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    cargarTabla();
}

// Función para cargar la tabla de usuarios
function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = '';

    for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let fila = document.createElement("tr");

        let celda = document.createElement("td");
        celda.innerHTML = `<a href="#" data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="${usuario.correo}" onclick="editar(${i})">${usuario.nombre}</a>`;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        // Botón de Eliminar
        celda = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger");
        btnEliminar.innerText = "Eliminar";
        btnEliminar.onclick = () => mostrarModalConfirmacion(i);
        celda.appendChild(btnEliminar);
        fila.appendChild(celda);
		
		// Crear el botón "Establecer contraseña"
		celda = document.createElement("td");
		let btnAgregar = document.createElement("button");
		btnAgregar.classList.add("btn", "btn-danger");
		btnAgregar.innerText = "Establecer contraseña"; // Cambiado el texto del botón
		btnAgregar.onclick = () => mostrarModalEstablecerPassword(i); // Llamar a la función mostrarModalEstablecerPassword al hacer clic
		celda.appendChild(btnAgregar);
		fila.appendChild(celda);


        tbody.appendChild(fila);
    }
}

// Función para mostrar el modal de confirmación para eliminar un usuario
function mostrarModalConfirmacion(index) {
    const modalConfirmacion = new bootstrap.Modal(document.getElementById('mdlConfirmacionEliminar'));
    modalConfirmacion.show();

    // Evento click para el botón de confirmar eliminar
    document.getElementById('btnConfirmarEliminar').onclick = () => {
        eliminarUsuario(index);
        modalConfirmacion.hide();
    };
}

// Función para eliminar un usuario de la lista y actualizar la tabla
function eliminarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    usuarios.splice(index, 1); // Eliminar el usuario en el índice proporcionado
    localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Actualizar localStorage
    cargarTabla(); // Actualizar tabla de usuarios
}
// Función para mostrar el modal de establecer contraseña
function mostrarModalEstablecerPassword(index) {
    // Obtener el usuario seleccionado
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios[index];

    // Mostrar el modal
    const modalEstablecerPassword = new bootstrap.Modal(document.getElementById('mdlEstablecerPassword'));
    modalEstablecerPassword.show();

    // Actualizar el label con el nombre de usuario
    document.getElementById('usuarioSeleccionado').innerText = usuario.nombre;

    // Evento click para el botón de confirmar establecer contraseña
    document.getElementById('btnConfirmarEstablecerPassword').onclick = () => {
        establecerPassword(index);
        modalEstablecerPassword.hide();
    };
}

// Función para establecer una nueva contraseña y actualizar el objeto en localStorage
function establecerPassword(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let nuevaContraseña = document.getElementById('nuevaContraseña').value;
    let confirmarContraseña = document.getElementById('confirmarContraseña').value;

    // Verificar que las contraseñas coincidan
    if (nuevaContraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
        return;
    }

    // Actualizar la contraseña del usuario
    usuarios[index].contraseña = nuevaContraseña;

    // Actualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Actualizar tabla de usuarios
    cargarTabla();
}

