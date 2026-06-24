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

  const percentual =
    meta && vendas
      ? Math.min((Number(vendas) / Number(meta)) * 100, 100)
      : 0;

  return (
    <div className="container">
      <h1>Performance</h1>

      <input
        type="number"
        placeholder="Meta de vendas"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor vendido"
        value={vendas}
        onChange={(e) => setVendas(e.target.value)}
      />

      <input
        type="number"
        placeholder="Comissão (%)"
        value={comissao}
        onChange={(e) => setComissao(e.target.value)}
      />

      <button onClick={calcular}>
        Calcular Comissão
      </button>

      {resultado !== null && (
        <div className="resultado">
          <h2>Resultado</h2>

          <p>
            <strong>Comissão:</strong> R$ {resultado.toFixed(2)}
          </p>

          <p>
            <strong>Meta atingida:</strong>{" "}
            {Number(vendas) >= Number(meta)
              ? "✅ Sim"
              : "❌ Não"}
          </p>

          <p>
            <strong>Percentual atingido:</strong>{" "}
            {percentual.toFixed(1)}%
          </p>

          <div className="barra">
            <div
              className="progresso"
              style={{ width: `${percentual}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;