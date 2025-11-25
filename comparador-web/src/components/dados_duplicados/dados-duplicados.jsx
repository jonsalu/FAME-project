import React, { useState } from "react";
import './dados-duplicados.css'
import { handleDuplicateData } from "../../services-front/double_dataService";
import { FaFileUpload } from "react-icons/fa";
import * as XLSX from 'xlsx';
import BackBtn from "../button/backbtn";

const DadosDuplicados = () => {
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

    // DOWNLOAD
    const handleDoubleData = async (e) => {
        e.preventDefault();
        setPreviewData(null);
        setMsg("");

        if (!file1) {
            setMsg("Selecione um arquivo!");
            return;
        }

        try {
            setLoadingDownload(true);
            const blob = await handleDuplicateData(file1, selectedHeaders, "download");

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "double_data_result.zip";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setMsg("Download iniciado!");
        } catch (error) {
            console.error("Erro no download:", error);
            setMsg("Erro ao tratar dados duplicados!");
        } finally {
            setLoadingDownload(false);
        }
    };

    // PREVIEW
    const handlePreview = async () => {
        setMsg("");
        setPreviewData(null);

        if (!file1) {
            setMsg("Selecione um arquivo!");
            return;
        }

        try {
            setLoadingPreview(true);
            const data = await handleDuplicateData(file1, selectedHeaders, "preview");
            console.log("Preview recebido do backend:", data);

            // Garantia: data deve ser array
            if (!Array.isArray(data)) {
                setMsg("Resposta inesperada do servidor.");
                console.error("Resposta preview inválida:", data);
                return;
            }

            if (data.length === 0) {
                setPreviewData([]); // para controlar render
                setMsg("Nenhuma duplicata encontrada.");
                return;
            }

            setPreviewData(data);
            setMsg(`${data.length} linha(s) duplicada(s) encontrada(s).`);
        } catch (error) {
            console.error("Erro ao gerar preview:", error);
            setMsg("Erro ao gerar preview!");
        } finally {
            setLoadingPreview(false);
        }
    };

    return (
        <div className="dados-duplicados">
            <form onSubmit={handleDoubleData} className="form1-dup">
                <div className="voltar-btn"><BackBtn /></div>

                <h2>Selecione o documento para limpar</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="input-single-dup">
                    <input type="file" accept=".xlsx, .xls" onChange={showHeaders} />
                    <label className="cloud-icon">
                        <FaFileUpload size={90} />
                        <p>Clique no botão <br /> para anexar</p>
                    </label>
                </div>

                <div className="submit-button-dup">
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
                    <div className="preview-container-dup">
                        <h3>Preview dos Dados Duplicados</h3>

                        <table className="preview-table">
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
                                            <td key={cIdx}>{row[col]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {previewData && previewData.length === 0 && (
                    <div className="preview-empty">
                        <p>Nenhuma duplicata encontrada.</p>
                    </div>
                )}

                <div className="instructions-dup">
                    <h3>Como funciona?</h3>
                    <ul>
                        <li>Selecione um arquivo.</li>
                        <li>Marque as colunas desejadas para análise.</li>
                        <li>Aguarde enquanto o arquivo é processado.</li>
                        <li>O resultado será baixado ou mostrado abaixo automaticamente.</li>
                    </ul>
                </div>
            </form>
        </div>
    );
};

export default DadosDuplicados;