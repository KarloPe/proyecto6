// Datos de muestra (simularán los datos cargados desde CSV)
let profesores = [];
let alumnos = [];
let cursos = [];
let calificaciones = {}; // Formato: {dniAlumno: {etapa1: calif, etapa2: calif, ...}}

// Estado actual de la aplicación
let docenteActual = null;
let cursoActual = null;
let etapaActual = 1;

// Elements DOM
const loginSection = document.getElementById('login-section');
const cursosSection = document.getElementById('cursos-section');
const alumnosSection = document.getElementById('alumnos-section');
const informeSection = document.getElementById('informe-section');
const loginForm = document.getElementById('login-form');
const etapaSelect = document.getElementById('etapa-select');
const cursoList = document.getElementById('curso-list');
const nombreDocente = document.getElementById('nombre-docente');
const docenteInfo = document.getElementById('docente-info');
const nombreCurso = document.getElementById('nombre-curso');
const alumnosTable = document.getElementById('alumnos-table');
const alumnosTbody = document.getElementById('alumnos-tbody');
const btnVolverCursos = document.getElementById('btn-volver-cursos');
const btnVolverAlumnos = document.getElementById('btn-volver-alumnos');
const btnGenerarInforme = document.getElementById('btn-generar-informe');
const btnDescargarInforme = document.getElementById('btn-descargar-informe');
const modalEditar = document.getElementById('modal-editar');
const alumnoInfo = document.getElementById('alumno-info');
const calificacionInput = document.getElementById('calificacion-input');
const alumnoDniEdit = document.getElementById('alumno-dni-edit');
const formEditarCalificacion = document.getElementById('form-editar-calificacion');
const btnCancelarEdit = document.getElementById('btn-cancelar-edit');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
const informeCurso = document.getElementById('informe-curso');
const informeEtapa = document.getElementById('informe-etapa');
const informeTbody = document.getElementById('informe-tbody');

// Inicialización: cargar datos desde CSV
document.addEventListener('DOMContentLoaded', () => {
    // Simulación de carga de datos CSV
    cargarDatosDePrueba();
    
    // Configurar event listeners
    configurarEventListeners();
});

// Carga de datos simulados (en una aplicación real esto vendría de archivos CSV)
function cargarDatosDePrueba() {
    // Datos de prueba para profesores (dni, nombre, apellido, codigo_curso)
    profesores = [
        { dni: '22345678', nombre: 'Juan', apellido: 'García', codigo_curso: 'MAT101' },
        { dni: '22345678', nombre: 'Juan', apellido: 'García', codigo_curso: 'FIS102' },
        { dni: '23456789', nombre: 'María', apellido: 'López', codigo_curso: 'QUI103' },
        { dni: '23456789', nombre: 'María', apellido: 'López', codigo_curso: 'BIO104' },
        { dni: '24567890', nombre: 'Carlos', apellido: 'Pérez', codigo_curso: 'HIS105' }
    ];
    
    // Datos de prueba para cursos (id_curso, nombre, dni_profesor)
    cursos = [
        { id_curso: 'MAT101', nombre: 'Matemáticas 1', dni_profesor: '22345678' },
        { id_curso: 'FIS102', nombre: 'Física 1', dni_profesor: '22345678' },
        { id_curso: 'QUI103', nombre: 'Química General', dni_profesor: '23456789' },
        { id_curso: 'BIO104', nombre: 'Biología', dni_profesor: '23456789' },
        { id_curso: 'HIS105', nombre: 'Historia Universal', dni_profesor: '24567890' }
    ];
    
    // Datos de prueba para alumnos (dni, nombre, apellido, codigo_curso)
    alumnos = [
        { dni: '30123456', nombre: 'Laura', apellido: 'Martínez', codigo_curso: 'MAT101' },
        { dni: '30234567', nombre: 'Pedro', apellido: 'Sánchez', codigo_curso: 'MAT101' },
        { dni: '30345678', nombre: 'Ana', apellido: 'Rodríguez', codigo_curso: 'MAT101' },
        { dni: '30456789', nombre: 'Diego', apellido: 'Fernández', codigo_curso: 'FIS102' },
        { dni: '30567890', nombre: 'Lucía', apellido: 'González', codigo_curso: 'FIS102' },
        { dni: '30678901', nombre: 'Miguel', apellido: 'Díaz', codigo_curso: 'QUI103' },
        { dni: '30789012', nombre: 'Sofía', apellido: 'Torres', codigo_curso: 'QUI103' },
        { dni: '30890123', nombre: 'Pablo', apellido: 'Ramírez', codigo_curso: 'BIO104' },
        { dni: '30901234', nombre: 'Elena', apellido: 'Vega', codigo_curso: 'BIO104' },
        { dni: '31012345', nombre: 'Javier', apellido: 'Castro', codigo_curso: 'HIS105' }
    ];
    
    // Inicializar calificaciones vacías para todos los alumnos en todas las etapas
    alumnos.forEach(alumno => {
        calificaciones[alumno.dni] = {
            etapa1: Math.floor(Math.random() * 4) + 7, // Calificaciones aleatorias entre 7 y 10
            etapa2: Math.floor(Math.random() * 4) + 7,
            etapa3: Math.floor(Math.random() * 4) + 7,
            etapa4: Math.floor(Math.random() * 4) + 7
        };
    });
    
    // Convertir los datos a formato CSV para su descarga
    generarArchivosCSV();
}

function configurarEventListeners() {
    // Login form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dni = document.getElementById('dni').value;
        iniciarSesion(dni);
    });
    
    // Cambio de etapa
    etapaSelect.addEventListener('change', () => {
        etapaActual = parseInt(etapaSelect.value);
        cargarCursosDocente();
    });
    
    // Volver a cursos desde alumnos
    btnVolverCursos.addEventListener('click', () => {
        mostrarSeccion(cursosSection);
        cursoActual = null;
    });
    
    // Volver a alumnos desde informe
    btnVolverAlumnos.addEventListener('click', () => {
        mostrarSeccion(alumnosSection);
    });
    
    // Generar informe
    btnGenerarInforme.addEventListener('click', () => {
        generarInforme();
    });
    
    // Descargar informe
    btnDescargarInforme.addEventListener('click', () => {
        descargarInforme();
    });
    
    // Cerrar modal de edición
    document.querySelector('.close').addEventListener('click', () => {
        modalEditar.style.display = 'none';
    });
    
    // Cancelar edición
    btnCancelarEdit.addEventListener('click', () => {
        modalEditar.style.display = 'none';
    });
    
    // Formulario de edición de calificación
    formEditarCalificacion.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarCalificacion();
    });
    
    // Cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        cerrarSesion();
    });
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === modalEditar) {
            modalEditar.style.display = 'none';
        }
    });
}

function iniciarSesion(dni) {
    // Verificar si el DNI pertenece a un profesor
    const profesor = profesores.find(p => p.dni === dni);
    if (profesor) {
        docenteActual = profesor;
        nombreDocente.textContent = `${profesor.nombre} ${profesor.apellido}`;
        docenteInfo.style.display = 'flex';
        etapaActual = parseInt(etapaSelect.value);
        cargarCursosDocente();
        mostrarSeccion(cursosSection);
    } else {
        alert('DNI no encontrado. Por favor, intente nuevamente.');
    }
}

function cerrarSesion() {
    docenteActual = null;
    cursoActual = null;
    docenteInfo.style.display = 'none';
    mostrarSeccion(loginSection);
    document.getElementById('dni').value = '';
}

function cargarCursosDocente() {
    cursoList.innerHTML = '';
    
    // Filtrar cursos del docente actual
    const cursosDocente = cursos.filter(curso => curso.dni_profesor === docenteActual.dni);
    
    if (cursosDocente.length === 0) {
        cursoList.innerHTML = '<p>No tiene cursos asignados.</p>';
        return;
    }
    
    // Crear tarjetas para cada curso
    cursosDocente.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'curso-card';
        card.innerHTML = `
            <h3>${curso.nombre}</h3>
            <p>Código: ${curso.id_curso}</p>
        `;
        card.addEventListener('click', () => {
            cursoActual = curso;
            cargarAlumnosCurso();
        });
        cursoList.appendChild(card);
    });
}

function cargarAlumnosCurso() {
    nombreCurso.textContent = cursoActual.nombre;
    alumnosTbody.innerHTML = '';
    
    // Filtrar alumnos del curso actual
    const alumnosCurso = alumnos.filter(alumno => alumno.codigo_curso === cursoActual.id_curso);
    
    if (alumnosCurso.length === 0) {
        alumnosTbody.innerHTML = '<tr><td colspan="5">No hay alumnos inscriptos en este curso.</td></tr>';
        return;
    }
    
    // Crear filas para cada alumno
    alumnosCurso.forEach(alumno => {
        const calificacion = calificaciones[alumno.dni][`etapa${etapaActual}`] || '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.dni}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.nombre}</td>
            <td>${calificacion}</td>
            <td>
                <button class="btn-primary btn-editar" data-dni="${alumno.dni}" data-nombre="${alumno.nombre}" data-apellido="${alumno.apellido}">
                    Editar
                </button>
            </td>
        `;
        alumnosTbody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
            const dni = btn.getAttribute('data-dni');
            const nombre = btn.getAttribute('data-nombre');
            const apellido = btn.getAttribute('data-apellido');
            abrirModalEdicion(dni, nombre, apellido);
        });
    });
    
    mostrarSeccion(alumnosSection);
}

function abrirModalEdicion(dni, nombre, apellido) {
    alumnoInfo.textContent = `${apellido}, ${nombre} (${dni})`;
    alumnoDniEdit.value = dni;
    calificacionInput.value = calificaciones[dni][`etapa${etapaActual}`] || '';
    modalEditar.style.display = 'block';
}

function guardarCalificacion() {
    const dni = alumnoDniEdit.value;
    const nuevaCalificacion = parseFloat(calificacionInput.value);
    
    if (isNaN(nuevaCalificacion) || nuevaCalificacion < 1 || nuevaCalificacion > 10) {
        alert('Por favor, ingrese una calificación válida entre 1 y 10.');
        return;
    }
    
    // Guardar la calificación
    calificaciones[dni][`etapa${etapaActual}`] = nuevaCalificacion;
    
    // Cerrar el modal y actualizar la vista
    modalEditar.style.display = 'none';
    cargarAlumnosCurso();
}

function generarInforme() {
    informeCurso.textContent = cursoActual.nombre;
    informeEtapa.textContent = etapaActual;
    informeTbody.innerHTML = '';
    
    // Filtrar alumnos del curso actual
    const alumnosCurso = alumnos.filter(alumno => alumno.codigo_curso === cursoActual.id_curso);
    
    if (alumnosCurso.length === 0) {
        informeTbody.innerHTML = '<tr><td colspan="4">No hay alumnos inscriptos en este curso.</td></tr>';
        return;
    }
    
    // Ordenar alumnos por apellido
    alumnosCurso.sort((a, b) => a.apellido.localeCompare(b.apellido));
    
    // Crear filas para cada alumno
    alumnosCurso.forEach(alumno => {
        const calificacion = calificaciones[alumno.dni][`etapa${etapaActual}`] || '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.dni}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.nombre}</td>
            <td>${calificacion}</td>
        `;
        informeTbody.appendChild(row);
    });
    
    mostrarSeccion(informeSection);
}

function descargarInforme() {
    const alumnosCurso = alumnos.filter(alumno => alumno.codigo_curso === cursoActual.id_curso);
    alumnosCurso.sort((a, b) => a.apellido.localeCompare(b.apellido));
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "DNI,Apellido,Nombre,Calificación\n";
    
    alumnosCurso.forEach(alumno => {
        const calificacion = calificaciones[alumno.dni][`etapa${etapaActual}`] || '-';
        csvContent += `${alumno.dni},${alumno.apellido},${alumno.nombre},${calificacion}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Informe_${cursoActual.nombre}_Etapa${etapaActual}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    loginSection.classList.remove('active-section');
    loginSection.classList.add('hidden-section');
    cursosSection.classList.remove('active-section');
    cursosSection.classList.add('hidden-section');
    alumnosSection.classList.remove('active-section');
    alumnosSection.classList.add('hidden-section');
    informeSection.classList.remove('active-section');
    informeSection.classList.add('hidden-section');
    
    // Mostrar la sección solicitada
    seccion.classList.remove('hidden-section');
    seccion.classList.add('active-section');
}

// Generar archivos CSV para descargar
function generarArchivosCSV() {
    // Profesores CSV
    generarCSV('profesores.csv', 
        ['dni', 'nombre', 'apellido', 'codigo_curso'],
        profesores.map(p => [p.dni, p.nombre, p.apellido, p.codigo_curso])
    );
    
    // Alumnos CSV
    generarCSV('alumnos.csv', 
        ['dni', 'nombre', 'apellido', 'codigo_curso'],
        alumnos.map(a => [a.dni, a.nombre, a.apellido, a.codigo_curso])
    );
    
    // Cursos CSV
    generarCSV('cursos.csv', 
        ['id_curso', 'nombre', 'dni_profesor'],
        cursos.map(c => [c.id_curso, c.nombre, c.dni_profesor])
    );
}

function generarCSV(nombre, encabezados, filas) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Agregar encabezados
    csvContent += encabezados.join(',') + '\n';
    
    // Agregar filas
    filas.forEach(fila => {
        csvContent += fila.join(',') + '\n';
    });
    
    // Crear link para descargar
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", nombre);
    document.body.appendChild(link);
    
    // No activamos el click automáticamente para no iniciar descargas sin intervención del usuario
    // En un entorno real, esto podría ser un botón que el usuario presione para descargar los datos de prueba
    
    document.body.removeChild(link);
}