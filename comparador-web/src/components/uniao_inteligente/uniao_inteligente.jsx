import React, { useState } from "react";
import "./uniao_inteligente.css"
import { FaFileUpload } from "react-icons/fa";
import BackBtn from "../button/backbtn";
import { obterCabecalhos, unirPlanilhas } from "../../services-front/uniao_inteligente_service";

const UniaoInteligente = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [message, setMessage] = useState("");
    
    const [headers, setHeaders] = useState([]); 
    const [commonHeader, setCommonHeader] = useState(""); 
    
    // Novo estado para guardar os dados do preview
    const [previewData, setPreviewData] = useState(null);

    const [loading, setLoading] = useState(false);

    // 1. Função para obter cabeçalhos da Planilha 1
    const handleFile1Change = async (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
        setHeaders([]); 
        setCommonHeader("");
        setMessage("");
        setPreviewData(null); // Limpa preview anterior

        if (selectedFile) {
            setLoading(true);
            try {
                const fetchedHeaders = await obterCabecalhos(selectedFile);
                setHeaders(fetchedHeaders);
                setMessage("Cabeçalhos da Planilha 1 carregados. Selecione a chave de união.");
            } catch (error) {
                setMessage(error.message || "Erro ao carregar cabeçalhos.");
                setFile1(null); 
            } finally {
                setLoading(false);
            }
        }
    };
    
    // 2. Função Central de Submissão (Preview ou Download)
    const handleSubmit = async (e, isPreview) => {
        e.preventDefault();
        
        if (!file1 || !file2 || !commonHeader) {
            setMessage("Selecione os dois arquivos e a coluna-chave.");
            return;
        }

        setLoading(true);
        setMessage(isPreview ? "Gerando visualização..." : "Processando download...");
        setPreviewData(null); // Limpa tabela antiga

        try {
            // Chama o serviço passando a flag isPreview
            const result = await unirPlanilhas(file1, file2, commonHeader, isPreview); 
            
            if (isPreview) {
                // Modo Preview: result é um objeto { columns: [], data: [] }
                setPreviewData(result);
                setMessage("Visualização gerada com sucesso.");
            } else {
                // Modo Download: result é um Blob
                const url = window.URL.createObjectURL(result);
                const a = document.createElement("a");
                a.href = url;
                a.download = "uniao_resultado.zip";
                a.click();
                window.URL.revokeObjectURL(url);
                setMessage("Download iniciado com sucesso!");
            }

        } catch (error) {
            setMessage(error.message || "Erro ao processar arquivos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="uniao-inteligente">
            {/* Note: Removi o onSubmit do form e passei para os botões para controlar o tipo */}
            <form className="form1-ui" onSubmit={(e) => e.preventDefault()}>
                <div className="voltar-btn">
                    <BackBtn />
                </div>
                <h2>Selecione os documentos para união</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="form-inputs-ui">
                    <div className="input-single-ui">
                        <input type="file" onChange={handleFile1Change} accept=".xlsx"/>
                        <label className="cloud-icon"><FaFileUpload size={90} />
                            <p>Clique ou arraste <br /> Planilha Base</p>
                        </label>
                    </div>
                    <div className="input-single-ui">
                        <input type="file" onChange={(e) => setFile2(e.target.files[0] || null)} accept=".xlsx"/>
                        <label className="cloud-icon"><FaFileUpload size={90} />
                            <p>Clique ou arraste <br /> Planilha Secundária</p>
                        </label>
                    </div>
                </div>

                {headers.length > 0 && (
                    <div className="headers-container-ui">
                        <h3>Selecione a coluna-chave (em comum):</h3>
                        <select
                            value={commonHeader}
                            onChange={(e) => setCommonHeader(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Selecione um cabeçalho...</option>
                            {headers.map((header, index) => (
                                <option key={index} value={header}>
                                    {header || "(vazio)"}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Botões lado a lado */}
                <div className="submit-button-ui" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    
                    <button 
                        type="button" // Importante ser type="button" para não submeter padrão
                        onClick={(e) => handleSubmit(e, false)} 
                        disabled={!file1 || !file2 || !commonHeader || loading}
                         // Exemplo de cor diferente (azul/info)
                    >
                        {loading ? "..." : "Download"}
                    </button>

                    <button 
                        type="button" 
                        onClick={(e) => handleSubmit(e, true)} 
                        disabled={!file1 || !file2 || !commonHeader || loading}
                    >
                        {loading ? "..." : "Preview"}
                    </button>
                </div>

                <p>{message}</p>

                {/* --- ÁREA DE PREVIEW (ESTILO IDENTICO AO DUPLICATAS) --- */}
            {previewData && previewData.data && previewData.data.length > 0 && (
                <div className="preview-container-dup">
                    <h3>Pré-visualização do Resultado</h3>

                    <table className="preview-table">
                        <thead>
                            <tr>
                                {previewData.columns.map((col, index) => (
                                    <th key={index}>{col}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {previewData.data.map((row, rIdx) => (
                                <tr key={rIdx}>
                                    {previewData.columns.map((col, cIdx) => (
                                        <td key={cIdx}>{row[col]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </form>

            

            

            {!previewData && (
                <div className="instructions-dup">
                    <h3>Como funciona?</h3>
                    <ul>
                        <li>Selecione a Planilha Base (seus cabeçalhos serão usados).</li>
                        <li>Selecione a Planilha Secundária.</li>
                        <li>Escolha a Coluna Chave (Ex: CPF, SKU) que existe em ambas.</li>
                        <li><strong>Visualizar:</strong> Veja o resultado na tela antes de baixar.</li>
                        <li><strong>Baixar:</strong> Receba o arquivo mesclado em ZIP.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UniaoInteligente;