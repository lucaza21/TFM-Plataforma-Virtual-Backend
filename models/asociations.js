const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Alumno = require("./alumno.model");
const Profesor = require("./profesor.model");
const CatCurso = require("./catcurso.model");
const CursoAlumno = require("./curso_alumno.model");
const Modulo = require("./modulo.model");
const Actividad = require("./actividades.model");
const Entrega = require("./entregas.model");
const Calificacion = require("./calificaciones.model");

Profesor.hasMany(CatCurso, {
    foreignKey: "id_profesor",
    as: 'cat_cursos',
    onDelete: "cascade",
});

CatCurso.belongsTo(Profesor,{
    foreignKey: "id_profesor",
    as: 'profesor',
    onDelete: "cascade",
});

// many-to-many => belongsToMany
//query desde [Alumno - CatCurso]
Alumno.belongsToMany(CatCurso, {
    through: "curso_alumno",
    foreignKey: "id_alumno",
    otherKey: "id_curso",
    as: 'cat_cursos',
    onDelete: "cascade",
})
CatCurso.belongsToMany(Alumno, {
    through: "curso_alumno",
    foreignKey: "id_curso",
    otherKey: "id_alumno",
    as: 'alumno',
    onDelete: "cascade",
})

// one-to-many => hasMany
//query desde [CursoAlumno]
Alumno.hasMany(CursoAlumno, {
  foreignKey: "id_alumno",
  as: 'curso_alumno',
  onDelete: "cascade",
});
CursoAlumno.belongsTo(Alumno,{
  foreignKey: "id_alumno",
  as: 'alumno',
  onDelete: "cascade",
});

CatCurso.hasMany(CursoAlumno, {
  foreignKey: "id_curso",
  as: 'curso_alumno',
  onDelete: "cascade",
});
CursoAlumno.belongsTo(CatCurso,{
  foreignKey: "id_curso",
  as: 'cat_cursos',
  onDelete: "cascade",
});

//
//query desde CatCurso - Modulo
CatCurso.hasMany(Modulo, {
  foreignKey: "id_curso",
  as: 'modulos',
  onDelete: "cascade",
});

Modulo.belongsTo(CatCurso,{
  foreignKey: "id_curso",
  as: 'cat_cursos',
  onDelete: "cascade",
});

//query desde Modulo - Actividades
Modulo.hasMany(Actividad,{
  foreignKey: "id_modulo",
  as: 'actividades',
  onDelete: "cascade",
});

Actividad.belongsTo(Modulo, {
  foreignKey: "id_modulo",
  as: 'modulos',
  onDelete: "cascade",
});

// one-to-one
//query desde Actividades - Entregas
Entrega.belongsTo(Actividad,{
  foreignKey: "id_actividad",
  as: 'actividades',
  onDelete: "cascade",
});

Actividad.belongsTo(Entrega, {
  foreignKey: "id_actividad",
  as: 'entrega_actividades',
  onDelete: "cascade",
});

//query desde Alumnos - Entregas
Alumno.hasMany(Entrega, {
  foreignKey: "id_alumno",
  as: 'entrega_actividades',
  onDelete: "cascade",
});
Entrega.belongsTo(Alumno,{
  foreignKey: "id_alumno",
  as: 'alumno',
  onDelete: "cascade",
});

// one-to-one
//query desde Entregas - Calificaciones
Entrega.belongsTo(Calificacion,{
  foreignKey: "id_entrega",
  as: 'calificaciones',
  onDelete: "cascade",
});

Calificacion.belongsTo(Entrega, {
  foreignKey: "id_entrega",
  as: 'entrega_actividades',
  onDelete: "cascade",
});




/* sequelize.sync({alter:true}).then((data) => {
    console.log("asociations synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table and model", error);
  }) */