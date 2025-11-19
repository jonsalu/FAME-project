import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import BackBtn from "../button/backbtn";
import { compararPlanilhas } from "../../services-front/compareService";
import './UploadForm.css'

function UploadForm() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [message, setMessage] = useState("");

  // preview removed: this component now only uploads and downloads the processed ZIP

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!file1 || !file2) {
    setMessage("Selecione os dois arquivos Excel antes de enviar.");
    return;
  }

  try {
    const blob = await compararPlanilhas(file1, file2);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultado.zip";
    a.click();
    window.URL.revokeObjectURL(url);
    setMessage("Download iniciado com sucesso!");
  } catch (error) {
    setMessage(error.message || "Erro ao enviar arquivos.");
  }
  };

  return (
    <div className="comparador">
            
            <form onSubmit={handleSubmit} className="form1-comp">
              <div className="voltar-btn">
                <BackBtn />
              </div>
                <h2>Selecione os documentos para comparação</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="form-inputs-comp">
                  <div className="input-single-comp">
                      <input type="file" onChange={(e) => setFile1(e.target.files[0] || null)}/>
                      <label className="cloud-icon">
                          <FaFileUpload size={90} />
                          <p>
                          Clique no botão <br /> para anexar
                          </p>
                      </label>
                  </div>
                  <div className="input-single-comp">
                      <input type="file" onChange={(e) => setFile2(e.target.files[0] || null)}/>
                      <label className="cloud-icon">
                          <FaFileUpload size={90} />
                          <p>
                          Clique no botão <br /> para anexar
                          </p>
                      </label>
                  </div>
                </div>

                <div className="submit-button-comp">
                    <button type="submit">Tratar</button>
                </div>

                <p>{message}</p>

                

                <div className="instructions-dup">
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
)}

export default UploadForm;

