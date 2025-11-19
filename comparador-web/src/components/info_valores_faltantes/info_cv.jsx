import React from "react";
import './info_cv.css'

const InfoCelulasVazias = () => {
    return(
         <div className="info-cv">
            <div className="instrucoes-cv">
                <h3>Como usar o detector de valores faltantes</h3>
                <div className="info-cv-step">
                    <p>1. Anexar a planilha em formato .xlsx</p>
                    <img src="../../public/cv-screen-print-step-1.png" alt="" />
                    <div className="info-cv-step-desc">
                        <p>Clique no botão de upload e selecione a planilha que deseja analisar. Após o envio, o programa exibirá todas as colunas encontradas na planilha.</p>
                    </div>
                </div>
                <div className="info-cv-step">
                    <p>2. Selecione as colunas desejadas para análise </p>
                    <img src="../../public/cv-screen-print-step-2.png" alt="" />
                    <div className="warn-info-cv-step-1">
                        
                        <p>Observe a lista de colunas disponíveis. Marque, através dos checkboxes, as colunas que você deseja que o programa verifique em busca de valores faltantes.</p>
                    </div>
                </div>
                <div className="info-cv-step">
                    <p>3. Iniciar a análise</p>
                    <img src="../../public/cv-screen-print-step-3.png" alt="" />
                    <div className="info-cv-step-desc">
                        <p>Após selecionar as colunas desejadas, clique no botão de download para iniciar o processo. O programa fará uma análise das colunas escolhidas procurando células vazias. Sempre que um valor faltante for encontrado, a linha inteira correspondente será marcada em <span style={{ color: "red" }}>vermelho</span>.</p>
                    </div>
                </div>
                <div className="info-cv-step">
                    <p>4. Receber o resultado</p>
                    <img src="../../public/cv-screen-print-step-4.png" alt="" />
                    <div className="info-cv-step-desc">
                        <p>Ao final da análise, o programa geraá automaticamente um arquivo .zip. Esse arquivo conterá uma nova planilha com todas as linhas que possuem valores faltantes devidamente destacadas.</p>
                    </div>
                </div>

                <div className="informacoes-importantes-cv">
                    <h4> Informações importantes!</h4>
                    <ul>
                        
                        <li>As planilhas devem estar no formato .xlsx (Excel).</li>
                        <li>A ferramenta só funciona corretamente se os nomes estiverem <strong>exatamente</strong> iguais (letras maiúsculas/minúsculas, acentos, espaços).</li>
                        <li>A primeira linha precisa conter os nomes das colunas (cabeçalho), caso contrário, não será reconhecida corretamente.</li>
                        <li>A ferramenta marca como "faltando" apenas valores: vazios, NaN, células completamente em branco.</li>
                        <li>String como "0", "-", "N/A", "NULL" <strong>não são consideradas vazias</strong>.</li>
                        <li>Evite colunas misturando texto e números</li>
                        <li>A ferramenta apenas marca os dados visuamente sem alterar os dados</li>
                        <li>Verifique se a planilha não está protegida</li>
                        
                    </ul>
                </div>
                
            </div>
        </div>
    )
}

export default InfoCelulasVazias