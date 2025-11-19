import React from "react";
import './dados-duplicados.css'
import { useState } from "react";
import { handleDuplicateData } from "../../services-front/double_dataService";
import { FaFileUpload } from "react-icons/fa";
import { TbSeparatorVertical } from "react-icons/tb";

import * as XLSX from 'xlsx';
import BackBtn from "../button/backbtn";

const DadosDuplicados = () => {
    const [file1, setFile1] = useState(null);
    const [msg, setMsg] = useState("")
    const [headers, setHeaders] = useState([])
    const [selectedHeaders, setSelectedHeaders] = useState([])

    const showHeaders = async (e) => {
        const selectedFile = e.target.files[0];
        setFile1(selectedFile);

        const data = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const firstRow = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];
        setHeaders(firstRow);
  };

    const handleCheckboxChange = (header) => {
        setSelectedHeaders(prev => 
        prev.includes(header)
        ? prev.filter(h => h !== header) // se já está marcada, remove
        : [...prev, header]              // se não está, adiciona
        );
    };

    const handleDoubleData = async (e) => {
        e.preventDefault()
            if (!file1) {
        setMsg("Selecione um arquivo!");
        return;
        }
    try{
        const res = await handleDuplicateData(file1, selectedHeaders)
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a');
        a.href = url
        a.download = "double_data_result.zip"
        document.body.appendChild(a)
        a.click() 
        a.remove()
        window.URL.revokeObjectURL(url)
        setMsg("Download iniciado!")
        
    }

    catch (error){
        setMsg("Erro ao tratar dados duplicados!")
    }
}

    return(
        <div className="dados-duplicados">
            
            <form onSubmit={handleDoubleData} className="form1-dup">
                <div className="voltar-btn">
                    <BackBtn />
                </div>
                <h2>Selecione o documento para limpar</h2>
                <p id="obs">Apenas arquivos xlsx</p>

                <div className="input-single-dup">
                    <input type="file" onChange={showHeaders} />
                    <label className="cloud-icon">
                        <FaFileUpload size={90} />
                        <p>
                        Clique no botão <br /> para anexar
                        </p>
                    </label>
                </div>

                <div className="submit-button-dup">
                    <button type="submit">Tratar</button>
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

    )
}

export default DadosDuplicados