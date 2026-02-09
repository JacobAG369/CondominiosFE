import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");

  // NUEVOS CAMPOS (per_dep)
  const [idDepa, setIdDepa] = useState("");   // ejemplo: 1
  const [idRol, setIdRol] = useState("1");    // 1=Residente, 2=Administrador
  const [residente, setResidente] = useState(true); // checkbox

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        nombre,
        apellido_p: apellidoP,
        apellido_m: apellidoM,
        celular,
        password,
        id_depa: Number(idDepa),
        id_rol: Number(idRol),
        residente: Boolean(residente),
      });

      alert("✅ Registro creado, ahora inicia sesión");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("❌ Error registro: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <input placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
      <input placeholder="Apellido Paterno" onChange={e => setApellidoP(e.target.value)} />
      <input placeholder="Apellido Materno" onChange={e => setApellidoM(e.target.value)} />
      <input placeholder="Celular" onChange={e => setCelular(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <hr />

      <h3>Datos del departamento</h3>

      <input
        placeholder="ID Departamento (ej: 1)"
        value={idDepa}
        onChange={e => setIdDepa(e.target.value)}
      />

      <select value={idRol} onChange={e => setIdRol(e.target.value)}>
        <option value="1">Residente</option>
        <option value="2">Administrador</option>
      </select>

      <label style={{ display: "block", marginTop: 10 }}>
        <input
          type="checkbox"
          checked={residente}
          onChange={e => setResidente(e.target.checked)}
        />
        Es residente
      </label>

      <button onClick={handleRegister} style={{ marginTop: 10 }}>
        Registrar
      </button>
    </div>
  );
}
