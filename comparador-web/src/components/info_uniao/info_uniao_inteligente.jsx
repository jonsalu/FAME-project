import React from "react";
import "./info_uniao_inteligente.css"
import { PiWarningBold } from "react-icons/pi";
import BackBtn from "../button/backbtn";


const InfoUniaoInteligente = () => {
    return(
        <div className="info-ui">
            <div className="instrucoes-ui">
                <h3><BackBtn/>Como usar a ferramenta de união inteligente</h3>
                <div className="info-ui-step">
                    <p>1. Anexar as planilhas em formato .xlsx</p>
                    <img src="../../public/ui-screen-print-step-1.png" alt="" />
                    <div className="info-ui-step-desc">
                        <p>Clique no botão de upload e selecione as planilha que deseja unir. Após o envio, o programa exibirá todas as colunas encontradas na primeira planilha.</p>
                    </div>
                </div>
                <div className="info-ui-step">
                    <p>2. Selecione a coluna desejada para a união </p>
                    <img src="../../public/ui-screen-print-step-2.png" alt="" />
                    <div className="warn-info-ui-step-1">
                        
                        <p>Observe a lista de colunas disponíveis. Selecione a coluna que servirá de parametro para o cruzamento de dados.</p>
                        <div className="warn-info-comp-step-1">
                            <PiWarningBold style={{ color: "#e9c600ff" }} size={20} />
                            <p>Apenas as colunas da PRIMEIRA planilha serão mapeadas, ela será a base para todo o processo de união.</p>
                        </div>
                    </div>
                </div>
                <div className="info-ui-step">
                    <p>3. Iniciar a união</p>
                    <img src="../../public/ui-screen-print-step-3.png" alt="" />
                    <div className="info-ui-step-desc">
                        <p>Após selecionar a coluna desejada, clique no botão de união para iniciar o processo. O programa fará uma análise das planilhas cruzando valores baseado na coluna escolhida.</p>
                    </div>
                </div>
                <div className="info-ui-step">
                    <p>4. Receber o resultado</p>
                    <img src="../../public/ui-screen-print-step-4.png" alt="" />
                    <div className="info-ui-step-desc">
                        <p>Ao final da análise, o programa gerará automaticamente um arquivo .zip. Esse arquivo conterá uma nova planilha unindo as informações das duas planilhas que tenham alguma relação.</p>
                    </div>
                </div>

                <div className="informacoes-importantes-ui">
                    <h4> Informações importantes!</h4>
                    <ul>
                        
                        <li>As planilhas devem estar no formato .xlsx (Excel).</li>
                        <li>A primeira planilha será usada como base e a segunda será usada para anexar as informações correspondentes à planilha 1</li>
                        <li>A coluna que você selecionar como chave deve existir e estar escrita de forma <strong>identica</strong> na planilha 1 e na planilha 2</li>
                        <li>Para o melhor funcionamento da ferramenta, certifique que os dados estejam os mais identicos possíveis.</li>
                        <li>As informações as quais não forem encontradas correspondências serão descartadas.</li>
                        <li>A ferramenta apenas organiza os dados visuamente sem alterar os dados</li>
                        <li>Verifique se a planilha não está protegida</li>
                        
                    </ul>
                </div>
                
            </div>
        </div>
    )
}

export default InfoUniaoInteligente