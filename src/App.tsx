import { useState } from "react";
import "./App.css";

function App() {
  const [meta, setMeta] = useState("");
  const [vendas, setVendas] = useState("");
  const [comissao, setComissao] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const total =
      Number(vendas) * (Number(comissao) / 100);

    setResultado(total);
  };

  return (
    <div>
      <h1>Performance</h1>

      <input
        type="number"
        placeholder="Meta de vendas"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Valor vendido"
        value={vendas}
        onChange={(e) => setVendas(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Comissão (%)"
        value={comissao}
        onChange={(e) => setComissao(e.target.value)}
      />

      <br /><br />

      <button onClick={calcular}>
        Calcular
      </button>

      {resultado !== null && (
        <div>
          <h2>Resultado</h2>
          <p>Comissão: R$ {resultado.toFixed(2)}</p>
          <p>
            Meta atingida: {Number(vendas) >= Number(meta) ? "✅ Sim" : "❌ Não"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;