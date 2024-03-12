
SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS plataforma_virtual;
CREATE SCHEMA plataforma_virtual;
USE plataforma_virtual;

CREATE TABLE profesor (
    id_profesor bigint NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ap_paterno VARCHAR(150),
    ap_materno VARCHAR(150),
    correo VARCHAR(150),
    celular VARCHAR(150),
    fecha_registro TIMESTAMP NOT NULL,
    usuario VARCHAR(150) UNIQUE,
    password VARCHAR(150),
    status SMALLINT,
    PRIMARY KEY (id_profesor)
    -- CONSTRAINT fk_usuarios_persona_id FOREIGN KEY (persona_id) REFERENCES personas (id),
    -- CONSTRAINT fk_usuarios_role_id FOREIGN KEY (role_id) REFERENCES cat_roles (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE alumno (
    id_alumno bigint NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ap_paterno VARCHAR(150),
    ap_materno VARCHAR(150),
    correo VARCHAR(150),
    celular VARCHAR(150),
    fecha_registro TIMESTAMP NOT NULL,
	usuario VARCHAR(150) UNIQUE,
    password VARCHAR(150),
    status SMALLINT,
    PRIMARY KEY (id_alumno)
    -- CONSTRAINT fk_usuarios_persona_id FOREIGN KEY (persona_id) REFERENCES personas (id),
    -- CONSTRAINT fk_usuarios_role_id FOREIGN KEY (role_id) REFERENCES cat_roles (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE curso_alumno (
    id_curso_alumno bigint NOT NULL AUTO_INCREMENT,
    id_curso bigint NOT NULL,
    id_alumno bigint,
    calificacion_global DECIMAL(10,2),
    PRIMARY KEY (id_curso_alumno),
    CONSTRAINT fk_curso_alumno_id_curso FOREIGN KEY (id_curso) REFERENCES cat_cursos (id_curso),
    CONSTRAINT fk_curso_alumno_id_alumno FOREIGN KEY (id_alumno) REFERENCES alumno (id_alumno)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE cat_cursos (
    id_curso bigint NOT NULL AUTO_INCREMENT,
    id_profesor bigint NOT NULL,
    titulo VARCHAR(100) NOT NULL UNIQUE,
    nombre_disenador VARCHAR(150) NOT NULL,
    objetivo VARCHAR(500),
    introduccion VARCHAR(500),
    metodologia VARCHAR(300),
    ruta_material_didactico JSON,
    perfil_ingreso VARCHAR(200),
    insumos VARCHAR(250),
    evaluacion VARCHAR(150),
    horas bigint NOT NULL,
    semanas integer,
    PRIMARY KEY (id_curso),
    CONSTRAINT fk_cat_cursos_id_profesor FOREIGN KEY (id_profesor) REFERENCES profesor (id_profesor)
    -- CONSTRAINT fk_cat_cursos_especialidad_id FOREIGN KEY (especialidad_id) REFERENCES cat_especialidades (id),
	-- CONSTRAINT fk_cat_cursos_tipo_id FOREIGN KEY (tipo_id) REFERENCES cat_tipo_curso (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE modulos (
    id_modulo bigint NOT NULL AUTO_INCREMENT,
    id_curso bigint NOT NULL,
    nombre_modulo VARCHAR(250),
    objetivo_particular VARCHAR(250),
	horas bigint NOT NULL,
	fecha_inicio TIMESTAMP NOT NULL,
	fecha_fin TIMESTAMP NOT NULL,
    ruta_material_didactico JSON,
    PRIMARY KEY (id_modulo),
    CONSTRAINT fk_modulos_id_curso FOREIGN KEY (id_curso) REFERENCES cat_cursos (id_curso)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE material_didactico (
    id_material_didactico bigint NOT NULL AUTO_INCREMENT,
    id_modulo bigint NOT NULL,
    ruta_material_didactico VARCHAR(1550),
    PRIMARY KEY (id_material_didactico),
    CONSTRAINT fk_material_didactico_id_modulo FOREIGN KEY (id_modulo) REFERENCES modulos (id_modulo)
    -- CONSTRAINT fk_usuarios_role_id FOREIGN KEY (role_id) REFERENCES cat_roles (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE actividades (
    id_actividad bigint NOT NULL AUTO_INCREMENT,
    id_modulo bigint NOT NULL,
    nombre_actividad VARCHAR(250),
    ponderacion_actividad DECIMAL(10,2),
	fecha_inicio TIMESTAMP NOT NULL,
	fecha_fin TIMESTAMP NOT NULL,
    ruta_actividad JSON,
    PRIMARY KEY (id_actividad),
    CONSTRAINT fk_actividades_id_modulo FOREIGN KEY (id_modulo) REFERENCES modulos (id_modulo)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE entrega_actividades (
    id_entrega bigint NOT NULL AUTO_INCREMENT,
    id_actividad bigint NOT NULL,
    id_alumno bigint NOT NULL,
    fecha_entrega TIMESTAMP NOT NULL,
    ruta_entrega VARCHAR(1500),
    comentario_entrega VARCHAR(500),
    PRIMARY KEY (id_entrega),
    CONSTRAINT fk_entrega_actividades_id_actividad FOREIGN KEY (id_actividad) REFERENCES actividades (id_actividad),
    CONSTRAINT fk_entrega_actividades_id_alumno FOREIGN KEY (id_alumno) REFERENCES alumno (id_alumno)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE calificaciones (
    id_calificacion bigint NOT NULL AUTO_INCREMENT,
    id_entrega bigint NOT NULL,
    calificacion bigint NOT NULL,
    comentario_calificacion VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_calificacion),
    CONSTRAINT fk_calificaciones_id_entrega FOREIGN KEY (id_entrega) REFERENCES entrega_actividades (id_entrega)
    -- CONSTRAINT fk_evaluaciones_alumno_id FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;







-- -- validar la fk alumno id
-- CREATE TABLE evaluaciones (
--     id bigint NOT NULL AUTO_INCREMENT,
--     actividad_id bigint NOT NULL,
--     alumno_id bigint NOT NULL,
--     fecha TIMESTAMP NOT NULL,
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_evaluaciones_actividad_id FOREIGN KEY (actividad_id) REFERENCES actividades (id),
--     CONSTRAINT fk_evaluaciones_alumno_id FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--  


-- CREATE TABLE calificaciones (
--     alumno_id bigint NOT NULL,
--     evaluacion_id bigint NOT NULL,
--     calificacion DOUBLE NOT NULL,
--     CONSTRAINT fk_calificaciones_evaluacion_id FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones (id),
-- 	CONSTRAINT fk_calificaciones_alumno_id FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

--  
--     
--     
-- CREATE TABLE actividades (
--     id bigint NOT NULL AUTO_INCREMENT,
--     grupo_id bigint,
--     tipoactividad_id bigint,
--     nombre VARCHAR(50),
--     descripcion VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id),
-- 	CONSTRAINT fk_actividades_grupo_id FOREIGN KEY (grupo_id) REFERENCES grupos (id),
-- 	CONSTRAINT fk_actividades_tipoactividad_id FOREIGN KEY (tipoactividad_id) REFERENCES cat_tipo_actividad (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
--     
-- CREATE TABLE cat_tipo_actividad (
--     id bigint NOT NULL AUTO_INCREMENT,
--     nombre VARCHAR(50) NOT NULL,
--     PRIMARY KEY (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

-- CREATE TABLE calendario (
--     actividad_id bigint NOT NULL,
--     fecha TIMESTAMP NOT NULL,
--     hora_inicio TIME NOT NULL,
--     hora_fin TIME NOT NULL,
--     enabled BOOL,
-- 	CONSTRAINT fk_calendario_actividad_id FOREIGN KEY (actividad_id) REFERENCES actividades (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;



-- CREATE TABLE grupos (
--     id bigint NOT NULL AUTO_INCREMENT,
--     curso_id bigint NOT NULL,
--     profesor_id bigint NOT NULL,
--     usuario_id bigint NOT NULL,
--     fecha_inicio TIMESTAMP NOT NULL,
--     fecha_fin TIMESTAMP NOT NULL,
--     avance_curso bigint NOT NULL,
--     direccion VARCHAR(50),
--     enabled BOOL,
--     PRIMARY KEY (id),
-- 	CONSTRAINT fk_grupos_curso_id FOREIGN KEY (curso_id) REFERENCES cat_cursos (id),
--     CONSTRAINT fk_grupos_profesor_id FOREIGN KEY (profesor_id) REFERENCES profesores (id),
--     CONSTRAINT fk_grupos_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
-- CREATE TABLE cat_cursos (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     especialidad_id bigint NOT NULL,
--     tipo_id bigint NOT NULL,
--     nombre VARCHAR(100),
--     descripcion VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_cat_cursos_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
--     CONSTRAINT fk_cat_cursos_especialidad_id FOREIGN KEY (especialidad_id) REFERENCES cat_especialidades (id),
--     CONSTRAINT fk_cat_cursos_tipo_id FOREIGN KEY (tipo_id) REFERENCES cat_tipo_curso (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
--     
-- CREATE TABLE cat_especialidades (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     campo_formacion_id bigint NOT NULL,
--     nombre VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id),
-- 	CONSTRAINT fk_cat_especialidades_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
--     CONSTRAINT fk_cat_especialidades_campo_formacion_id FOREIGN KEY (campo_formacion_id) REFERENCES cat_campo_formacion (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
--     
-- CREATE TABLE cat_tipo_curso (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     nombre VARCHAR(150),
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_cat_tipo_curso_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--  
--  
-- -- validar si lleva fk hacia usuario.
-- CREATE TABLE material_didactico (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     curso_id bigint NOT NULL,
--     nombre VARCHAR(100),
--     ruta varchar(50),
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_material_didactico_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
-- 	CONSTRAINT fk_material_didactico_curso_id FOREIGN KEY (curso_id) REFERENCES cat_curso (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

--  
--     
--     
-- CREATE TABLE cat_campo_formacion (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     unidad_capacitacion_id bigint NOT NULL,
--     nombre VARCHAR(50),
--     descripcion VARCHAR(50),
--     PRIMARY KEY (id),
-- 	CONSTRAINT fk_cat_campo_formacion_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
--     CONSTRAINT fk_cat_campo_formacion_unidad_capacitacion_id FOREIGN KEY (unidad_capacitacion_id) REFERENCES cat_unidad_capacitacion (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
-- CREATE TABLE cat_unidad_capacitacion (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     nombre VARCHAR(100),
--     direccion VARCHAR(100),
--     descripcion VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_cat_unidad_capacitacion_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;



--     
--     
-- CREATE TABLE cat_roles (
--     id bigint NOT NULL AUTO_INCREMENT,
--     nombre VARCHAR(100),
--     descripcion VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

-- CREATE TABLE movimientos (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint NOT NULL,
--     fecha_hora TIMESTAMP NOT NULL,
--     url VARCHAR(100),
--     movimiento VARCHAR(100),
--     cuerpo VARCHAR(100),
--     descripcion VARCHAR(100),
--     PRIMARY KEY (id),
--     CONSTRAINT fk_movimientos_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

--  
--  
-- CREATE TABLE grupo_alumnos (
--     grupo_id bigint NOT NULL,
--     alumnos_id bigint NOT NULL,
--      CONSTRAINT fk_grupo_alumnos_grupo_id FOREIGN KEY (grupo_id) REFERENCES grupos (id),
--     CONSTRAINT fk_grupo_alumnos_alumnos_id FOREIGN KEY (alumnos_id) REFERENCES alumnos (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
--     
-- CREATE TABLE notificaciones_grupo (
--     grupo_id bigint NOT NULL,
--     descripcion VARCHAR(200),
--     fecha TIMESTAMP,
--     hora TIME,
--     CONSTRAINT fk_notificaciones_grupo_id FOREIGN KEY (grupo_id) REFERENCES grupos (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;



--     
--     
-- CREATE TABLE alumnos (
--     id bigint NOT NULL AUTO_INCREMENT,
--     persona_id bigint,
--     fecha_registro TIMESTAMP,
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_alumnos_persona_id FOREIGN KEY (persona_id) REFERENCES personas (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
--     
-- CREATE TABLE profesores (
--     id bigint NOT NULL AUTO_INCREMENT,
--     persona_id bigint,
--     fecha_ingreso TIMESTAMP,
--     correo_institucional VARCHAR(150),
--     enabled BOOL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_profesores_persona_id FOREIGN KEY (persona_id) REFERENCES personas (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;



--     
--     
-- CREATE TABLE personas (
--     id bigint NOT NULL AUTO_INCREMENT,
--     nombre VARCHAR(100),
--     ap_paterno VARCHAR(100),
--     ap_materno VARCHAR(100),
--     correo_personal VARCHAR(100),
--     celular VARCHAR(100),
--     telefono VARCHAR(100),
--     extension VARCHAR(100),
--     enabled BOOL,
--     PRIMARY KEY (id)
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

-- CREATE TABLE usuarios (
--     id bigint NOT NULL AUTO_INCREMENT,
--     persona_id bigint NOT NULL,
--     role_id bigint NOT NULL,
--     usuario VARCHAR(150),
--     password VARCHAR(150),
--     estado SMALLINT,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_usuarios_persona_id FOREIGN KEY (persona_id) REFERENCES personas (id),
--     CONSTRAINT fk_usuarios_role_id FOREIGN KEY (role_id) REFERENCES cat_roles (id)
--     
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;


--     
-- CREATE TABLE sesion (
--     id bigint NOT NULL AUTO_INCREMENT,
--     usuario_id bigint not null,
--     fecha_inicio TIMESTAMP,
--     token VARCHAR(100),
--     fecha_fin TIMESTAMP,
--     estado SMALLINT,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_sesion_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
--     
-- )  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4;

