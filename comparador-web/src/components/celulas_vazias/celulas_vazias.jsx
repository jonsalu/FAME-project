import React, { useState } from "react";
import './celulas_vazias.css'; // Adaptado para o CSS correto
import { handleCelulasVazias } from "../../services-front/celulas_vazias_service"; // Serviço correto
import { FaFileUpload } from "react-icons/fa";
import * as XLSX from 'xlsx';
import BackBtn from "../button/backbtn";

const CelulasVazias = () => {
    const [file1, setFile1] = useState(null);
    const [msg, setMsg] = useState("");
    const [headers, setHeaders] = useState([]);
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);

    const showHeaders = async (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
        setPreviewData(null);
        setMsg("");

        try {
            const data = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const firstRow = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0] || [];
            setHeaders(firstRow);
        } catch (err) {
            console.error("Erro ao ler arquivo local:", err);
            setMsg("Erro ao ler o arquivo. Verifique se é um .xlsx válido.");
            setHeaders([]);
        }
    };

    const handleCheckboxChange = (header) => {
        setSelectedHeaders(prev =>
            prev.includes(header)
                ? prev.filter(h => h !== header)
                : [...prev, header]
        );
    };

    // DOWNLOAD (Adaptado para processar vazios)
    const handleDownload = async (e) => {
        e.preventDefault();
        setPreviewData(null);
        setMsg("");

        if (!file1) {
            setMsg("Selecione um arquivo!");
            return;
        }

        try {
            setLoadingDownload(true);
            // Chama o serviço com modo "download"
            const blob = await handleCelulasVazias(file1, selectedHeaders, "download");

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "linhas_vazias_tratadas.zip"; // Nome do arquivo ajustado
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setMsg("Download iniciado!");
        } catch (error) {
            console.error("Erro no download:", error);
            setMsg("Erro ao tratar células vazias!");
        } finally {
            setLoadingDownload(false);
        }
    };

   // PREVIEW (Corrigido)
    const handlePreview = async () => {
        setMsg("");
        setPreviewData(null);

        if (!file1) {
            setMsg("Selecione um arquivo!");
            return;
        }

        try {
            setLoadingPreview(true);
            
            // 1. Recebe a resposta do backend
            const response = await handleCelulasVazias(file1, selectedHeaders, "preview");
            console.log("Resposta bruta do backend:", response);

            // 2. Tenta extrair o array. 
            // Se o backend mandou { "dados": [...] }, pegamos response.dados.
            // Se o backend mandou direto [...], pegamos response.
            const listaDeErros = response.dados || response;

            // 3. Agora validamos se é um array
            if (!Array.isArray(listaDeErros)) {
                setMsg("Resposta inesperada do servidor (formato inválido).");
                console.error("Esperava array, recebeu:", response);
                return;
            }

            if (listaDeErros.length === 0) {
                setPreviewData([]); 
                setMsg("Nenhuma célula vazia encontrada.");
                return;
            }

            // 4. Salva o array correto no estado
            setPreviewData(listaDeErros);
            setMsg(`${listaDeErros.length} linha(s) com células vazias encontrada(s).`);

        } catch (error) {
            console.error("Erro ao gerar preview:", error);
            setMsg("Erro ao gerar preview!");
        } finally {
            setLoadingPreview(false);
        }
    };

    return (
        <div className="celulas-vazias">
            {/* O onSubmit agora aponta para handleDownload */}
            <form onSubmit={handleDownload} className="form-cv">
                <div className="voltar-btn"><BackBtn /></div>

                <h2>Selecione o documento para verificar</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="input-single-cv">
                    <input type="file" accept=".xlsx, .xls" onChange={showHeaders} />
                    <label className="cloud-icon">
                        <FaFileUpload size={90} />
                        <p>Clique no botão <br /> para anexar</p>
                    </label>
                </div>

                <div className="submit-button-cv">
                    <button type="submit" disabled={loadingDownload}>
                        {loadingDownload ? "Processando..." : "Download"}
                    </button>

                    <button type="button" onClick={handlePreview} disabled={loadingPreview}>
                        {loadingPreview ? "Gerando preview..." : "Preview"}
                    </button>
                </div>

                <p>{msg}</p>

                {headers.length > 0 && (
                    <div className="headers-container">
                        <h3>Selecione os cabeçalhos desejados:</h3>
                        {headers.map((header, index) => (
                            <label key={index} className="header-option">
                                <input
                                    type="checkbox"
                                    checked={selectedHeaders.includes(header)}
                                    onChange={() => handleCheckboxChange(header)}
                                />
                                {header || <i>(vazio)</i>}
                            </label>
                        ))}
                    </div>
                )}

                {previewData && previewData.length > 0 && (
                    <div className="preview-container-cv">
                        <h3>Preview das Linhas Vazias</h3>

                        <table className="preview-table-cv">
                            <thead>
                                <tr>
                                    {Object.keys(previewData[0]).map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {previewData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {Object.keys(previewData[0]).map((col, cIdx) => (
                                            // ADAPTAÇÃO NECESSÁRIA: Estilo condicional para mostrar o erro
                                            <td 
                                                key={cIdx}
                                                style={row[col] === null ? { color: 'red', fontWeight: 'bold', backgroundColor: '#ffebee' } : {}}
                                            >
                                                {row[col] === null ? "VAZIO" : row[col]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {previewData && previewData.length === 0 && (
                    <div className="preview-empty">
                        <p>Nenhuma linha vazia encontrada.</p>
                    </div>
                )}

                <div className="instructions-dup">
                    <h3>Como funciona?</h3>
                    <ul>
                        <li>Selecione um arquivo.</li>
                        <li>Marque as colunas que não podem ser vazias.</li>
                        <li>Aguarde enquanto o arquivo é processado.</li>
                        <li>O resultado será baixado ou mostrado abaixo automaticamente.</li>
                    </ul>
                </div>
            </form>
        </div>
    );
};

export default CelulasVazias;