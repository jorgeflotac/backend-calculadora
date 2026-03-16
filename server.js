const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

const operacionSchema = new mongoose.Schema({
  num1: Number,
  num2: Number,
  operacion: String,
  resultado: Number
});

const Operacion = mongoose.model("Operacion", operacionSchema);

app.get("/operaciones", async (req, res) => {
    const datos = await Operacion.find();
    res.json(datos);
});

app.post("/operaciones", async (req, res) => {

    const { num1, num2, operacion } = req.body;

    let resultado;

    if (operacion === "suma") resultado = num1 + num2;
    if (operacion === "resta") resultado = num1 - num2;
    if (operacion === "multiplicacion") resultado = num1 * num2;
    if (operacion === "division") resultado = num1 / num2;

    const nueva = new Operacion({ num1, num2, operacion, resultado });

    await nueva.save();

    res.json(nueva);
});

app.delete("/operaciones/:id", async (req,res)=>{
    await Operacion.findByIdAndDelete(req.params.id);
    res.json({mensaje:"Operacion eliminada"});
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});