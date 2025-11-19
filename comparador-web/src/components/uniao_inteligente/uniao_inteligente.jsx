import React, { useState } from "react";
import "./uniao_inteligente.css"
import { FaFileUpload } from "react-icons/fa";
import BackBtn from "../button/backbtn";
// Importar o serviço de união
import { obterCabecalhos, unirPlanilhas } from "../../services-front/uniao_inteligente_service"; // Crie este arquivo

const UniaoInteligente = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [message, setMessage] = useState("");
    
    // Lista de todos os cabeçalhos da Planilha 1 (para o dropdown)
    const [headers, setHeaders] = useState([]); 
    
    // A coluna única escolhida para o merge
    const [commonHeader, setCommonHeader] = useState(""); 
    
    const [loading, setLoading] = useState(false);

    // --- FUNÇÕES DE LÓGICA ---

    // 1. Função para obter cabeçalhos da Planilha 1
    const handleFile1Change = async (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);
        setHeaders([]); // Limpa cabeçalhos antigos
        setCommonHeader("");
        setMessage("");

        if (selectedFile) {
            setLoading(true);
            try {
                // Chama o endpoint de pré-análise (router.post("/uniao-cabecalhos"))
                const fetchedHeaders = await obterCabecalhos(selectedFile);
                setHeaders(fetchedHeaders);
                setMessage("Cabeçalhos da Planilha 1 carregados. Selecione a chave de união.");
            } catch (error) {
                setMessage(error.message || "Erro ao carregar cabeçalhos.");
                setFile1(null); // Limpa o arquivo para forçar upload novamente
            } finally {
                setLoading(false);
            }
        }
    };
    
    // 2. Função de Submissão Final (União)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file1 || !file2 || !commonHeader) {
            setMessage("Selecione os dois arquivos e a coluna-chave (cabeçalho comum).");
            return;
        }

        setLoading(true);
        setMessage("Processando união... Aguarde.");

        try {
            // Chama o endpoint de união final (router.post("/uniao-inteligente"))
            const blob = await unirPlanilhas(file1, file2, commonHeader); 
            
            // Lógica de download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "uniao_resultado.zip";
            a.click();
            window.URL.revokeObjectURL(url);
            
            setMessage("Download iniciado com sucesso!");
        } catch (error) {
            setMessage(error.message || "Erro ao enviar arquivos ou na união.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZAÇÃO ---

    return (
        <div className="uniao-inteligente">
            <form className="form1-ui" onSubmit={handleSubmit}>
                <div className="voltar-btn">
                    <BackBtn />
                </div>
                <h2>Selecione os documentos para união</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="form-inputs-ui">
                    {/* INPUT 1: Dispara a análise */}
                    <div className="input-single-ui">
                        <input type="file" onChange={handleFile1Change} accept=".xlsx"/>
                        <label className="cloud-icon"><FaFileUpload size={90} />
                                                <p>
                                                Clique no botão <br /> para anexar
                                                </p></label>
                    </div>
                    {/* INPUT 2: Apenas upload */}
                    <div className="input-single-ui">
                        <input type="file" onChange={(e) => setFile2(e.target.files[0] || null)} accept=".xlsx"/>
                        <label className="cloud-icon"><FaFileUpload size={90} />
                                                <p>
                                                Clique no botão <br /> para anexar
                                                </p></label>
                    </div>
                </div>

                {/* Seletor de Coluna-Chave (Dropdown) */}
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

                <div className="submit-button-ui">
                    <button type="submit" disabled={!file1 || !file2 || !commonHeader || loading}>
                        {loading ? "Processando..." : "Unir Planilhas"}
                    </button>
                </div>

                <p>{message}</p>
                <div className="instructions-dup">
                    <h3>Como funciona?</h3>
                    <ul>
                        <li>Selecione um arquivo.</li>
                        <li>Marque a coluna parâmetro.</li>
                        <li>Aguarde enquanto o arquivo é processado.</li>
                        <li>O resultado será baixado automaticamente.</li>
                    </ul>
                </div>
            </form>
        </div>
    );
};

export default UniaoInteligente;