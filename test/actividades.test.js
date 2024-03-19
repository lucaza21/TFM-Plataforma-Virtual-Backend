const Actividad = require('../models/actividades.model')
const Alumnos = require('../models/alumno.model')
const calificaciones = require('../models/calificaciones.model')
const request = require('supertest');


describe("mostrar la lista de actividades", () => {
  describe("find all", () => {
    it("should return empty array on find all", async () => {

      // Execute
      const listActividad = await  Actividad.findAll();

      expect(listActividad)
        });
  })
})


describe("mostrar la lista de Alumnos", () => {
  describe("find all", () => {
    it("should return an array on find all alumnos", async () => {

      // Execute
      const listActividad = await  Alumnos.findAll();
     
      expect(listActividad).toBeInstanceOf(Array)
        });
  })
})

describe("Crear un registro en la table Calificaciones", () => {
  describe("Insert into calificaciones", () => {
    it("Debera crear un registro",  () => {

      // Execute
      const req = {
        "id_entrega": 5,
        "calificacion": 9.5,
        "comentario_calificacion": "muy bien"
      }
       
      const response = calificaciones.create(req)

      expect(response)
        });
  })
})