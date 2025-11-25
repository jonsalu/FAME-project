import React from "react";
import './info_duplicatas.css'
import { PiWarningBold } from "react-icons/pi";
import BackBtn from "../button/backbtn";

const InfoDuplicatas = () => {
    return(
        <div className="info-duplicatas">
            <div className="instrucoes-duplicatas">
                <h3><BackBtn/>Como usar o detector de duplicatas</h3>
                <div className="info-duplicatas-step">
                    <p>1. Anexar a planilha em formato .xlsx</p>
                    <img src="../../public/cv-screen-print-step-1.png" alt="" />
                    <div className="info-duplicatas-step-desc">
                        <p>Clique no botão de upload e selecione a planilha que deseja analisar. Após o envio, o programa exibirá todas as colunas encontradas na planilha.</p>
                    </div>
                </div>
                <div className="info-duplicatas-step">
                    <p>2. Selecione as colunas desejadas para análise </p>
                    <img src="../../public/cv-screen-print-step-2.png" alt="" />
                    <div className="info-duplicatas-step-desc">
                        
                        <p>Observe a lista de colunas disponíveis. Marque, através dos checkboxes, as colunas que você deseja que o programa verifique em busca de valores faltantes.</p>
                        <div className="warn-info-duplicatas-step-1">
                            <PiWarningBold style={{ color: "#e9c600ff" }} size={20} />
                            <p>As colunas marcadas são analisadas em conjunto. Para que uma linha seja considerada duplicata, <strong>todas as colunas selecionadas</strong> precisam ser idênticas.</p>
                        </div>
                    </div>
                </div>
                <div className="info-duplicatas-step">
                    <p>3. Iniciar a análise</p>
                    <img src="../../public/duplicata-screen-img-step-3.png" alt="" />
                    <div className="info-duplicatas-step-desc">
                        <p>Após selecionar as colunas desejadas, clique no botão de download para iniciar o processo. O programa verificará os registros da planilha de identificará linhas duplicadas com base nas colunas escolhidas. Todas as duplicatas terão a linha inteira pintada de <span style={{ color: "#e9ba00ff" }}>amarelo</span>.</p>
                    </div>
                </div>
                <div className="info-duplicatas-step">
                    <p>4. Receber o resultado</p>
                    <img src="../../public/duplicata-screen-img-step-4.png" alt="" />
                    <div className="info-duplicatas-step-desc">
                        <p>Ao final da análise, o programa gerará automaticamente um arquivo .zip. Esse arquivo conterá uma nova planilha com todas as linhas duplicadas devidamente marcadas.</p>
                    </div>
                </div>
                <div className="info-duplicatas-step">
                    <p>5. visualização do preview</p>
                    <img src="../../public/cv-screen-print-step-5.png" alt="" />
                    <div className="info-duplicatas-step-desc">
                        <p>Ao clicar na função preview, será mostrado abaixo dos cabeçalhos uma lista apenas com as linhas com dados duplicados encontrados.</p>
                        <div className="warn-info-duplicatas-step-1">
                            <PiWarningBold style={{ color: "#e9c600ff" }} size={20} />
                            <p>A função preview não é recomendada para planilhas grandes (&lt; 300 linhas).</p>
                        </div>
                    </div>
                </div>

                <div className="informacoes-importantes-duplicatas">
                    <h4> Informações importantes!</h4>
                    <ul>
                        
                        <li>As planilhas devem estar no formato .xlsx (Excel).</li>
                        <li>A duplicata será detectada quando <strong>todas as colunas selecionadas</strong> tiverem valores iguais.</li>
                        <li>Se apenas uma coluna for selecionada, a análise será individual.</li>
                        <li>A primeira linha precisa conter os nomes das colunas (cabeçalho), caso contrário, não será reconhecida corretamente.</li>
                        <li>Linhas completamente vazias são ignoradas.</li>
                        <li>Certifique-se de que os dados estejam padronizados (espaços desnecessários, valores digitados corretamente, dados consistentes)</li>
                        <li>A ferramenta apenas marca os dados visuamente sem alterar os dados</li>
                        <li>Verifique se a planilha não está protegida</li>
                        
                    </ul>
                </div>
                
            </div>
        </div>
    )
}

export default InfoDuplicatas