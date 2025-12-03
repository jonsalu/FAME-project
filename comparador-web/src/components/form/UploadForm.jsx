import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import BackBtn from "../button/backbtn";
import { compararPlanilhas } from "../../services-front/compareService";
import "./UploadForm.css";

function UploadForm() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [message, setMessage] = useState("");

  // O previewData agora será o array bruto que vem do back
  const [previewData, setPreviewData] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!file1 || !file2) {
      setMessage("Selecione os dois arquivos Excel antes de enviar.");
      return;
    }
    try {
      const result = await compararPlanilhas(file1, file2, "download");
      if (result.tipo === "download") {
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resultado_comparacao.zip";
        a.click();
      }
      setMessage("Download iniciado com sucesso!");
    } catch (error) {
      setMessage(error.message || "Erro ao enviar arquivos.");
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();

    if (!file1 || !file2) {
      setMessage("Selecione os dois arquivos Excel antes de enviar.");
      return;
    }

    try {
      console.log("1. Enviando pedido de preview...");
      const result = await compararPlanilhas(file1, file2, "preview");

      console.log("2. Resposta bruta recebida:", result);

      if (result.tipo === "preview") {
        // Verificação de segurança
        if (result.data && result.data.dados) {
          console.log("4. Quantidade de linhas:", result.data.dados.length);
          setPreviewData(result.data.dados);
          setMessage("Preview carregado!");
        } else {
          console.error("ERRO: O objeto não tem a chave 'dados'. Estrutura:", result.data);
          setMessage("Erro: Formato de dados inválido.");
        }
      }
    } catch (error) {
      console.error("ERRO FATAL:", error);
      setMessage(error.message || "Erro ao gerar preview.");
    }
  };

  // ---------------------------------------------------------
  // 🔥 Lógica de Renderização (DEFINIDA AQUI, ANTES DO RETURN)
  // ---------------------------------------------------------
  const renderGenericTable = (data, title) => {
    if (!data || data.length === 0) return null;

    // A estrutura do backend é: item.campos = { "Header": { valor: "x", status: "verde" } }
    const headers = Object.keys(data[0].campos);

    return (
      <div className="preview-container-cv">
        <h3>{title}</h3>

        <table className="preview-table-cv">
          <thead>
            <tr>
              {headers.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIdx) => (
              <tr key={rIdx}>
                {headers.map((col, cIdx) => {
                  const cellData = row.campos[col];
                  const isGreen = cellData.status === "verde";
                  const isRed = cellData.status === "vermelho";

                  return (
                    <td
                      key={cIdx}
                      style={
                        // Lógica de cores baseada no status
                        isRed
                          ? { color: "red", fontWeight: "bold", backgroundColor: "#ffebee" }
                          : isGreen
                          ? { color: "green", fontWeight: "bold", backgroundColor: "#e8f5e9" }
                          : {}
                      }
                    >
                      {cellData.valor}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---------------------------------------------------------
  // AREA DE RENDERIZAÇÃO (HTML)
  // ---------------------------------------------------------
  return (
    <div className="comparador">
      <form className="form1-comp">
        <div className="voltar-btn">
          <BackBtn />
        </div>

        <h2>Selecione os documentos para comparação</h2>
        <p id="obs">Apenas arquivos xlsx</p>

        <div className="form-inputs-comp">
          <div className="input-single-comp">
            <input type="file" onChange={(e) => setFile1(e.target.files[0])} />
            <label className="cloud-icon">
              <FaFileUpload size={90} />
              <p>
                Clique para anexar
                <br />
                Planilha Antiga/Base
              </p>
            </label>
            {file1 && <span className="file-name">{file1.name}</span>}
          </div>
          <div className="input-single-comp">
            <input type="file" onChange={(e) => setFile2(e.target.files[0])} />
            <label className="cloud-icon">
              <FaFileUpload size={90} />
              <p>
                Clique para anexar
                <br />
                Planilha Nova
              </p>
            </label>
            {file2 && <span className="file-name">{file2.name}</span>}
          </div>
        </div>

        <div className="submit-button-comp">
          <button onClick={handleDownload}>Download</button>
          <button type="button" onClick={handlePreview} className="btn-preview">
            Preview
          </button>
        </div>

        <p className="status-msg">{message}</p>

        {/* CHAMADA DA FUNÇÃO DE PREVIEW AQUI */}
        {previewData && (
          <div className="preview-comp">
            <h3>Legenda da comparação: <span style={{ color: "green" }}>Verde</span> - Linhas em comum | <span style={{ color: "red" }}>Vermelho</span> - Linhas não encontradas</h3>
          
            
            {/* AQUI: Adicione a classe 'preview-side-by-side' nesta div */}
            <div className="preview-side-by-side">
              
              {renderGenericTable(
                previewData.filter((item) => item.origem === "PLANILHA_1")
              )}

              {renderGenericTable(
                previewData.filter((item) => item.origem === "PLANILHA_2")
              )}
              
            </div>
          </div>
        )}

        <div className="instructions-comp">
                    <h3>Como funciona?</h3>
                    <ul>
                        <li>Selecione um arquivo.</li>
                        <li>Marque as colunas desejadas para análise.</li>
                        <li>Aguarde enquanto o arquivo é processado.</li>
                        <li>O resultado será baixado automaticamente.</li>
                    </ul>
                </div>
      </form>
    </div>
  );
}

export default UploadForm;