import React from "react";

import "./info_comparador.css"
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { PiWarningBold } from "react-icons/pi";
import { FaGears } from "react-icons/fa6";
import { FaFileDownload } from "react-icons/fa";





const InfoComparador = () => {
    return(

        <div className="info-comparador">
            <div className="instrucoes-comparador">
                <h3>Como usar o comparador de planilhas</h3>
                <div className="info-comp-step">
                    <p>1. Pré-tratamento</p>
                    <img src="../../public/comp-screen-print-step-2.png" alt="" />
                    <div className="info-comp-step-desc">
                        <p>O comparador tem como parametro APENAS a PRIMEIRA, SEGUNDA e TERCEIRA coluna de cada planilha, respectivamente. Antes de anexa-las, verifique se os dados estão organizados conforme o exemplo acima.</p>
                         <div className="warn-info-comp-step-1">
                        <PiWarningBold style={{ color: "#e9c600ff" }} size={20} />
                        <p>Caso queira comparar apenas 1 ou 2 colunas, posicione as colunas desejadas entre as 3 primeiras e deixe a(s) outra(s) vazia(s).</p>
                    </div>
                    </div>
                </div>
                <div className="info-comp-step">
                    <p>2. Selecione as planilhas desejadas em formato .xlsx <PiMicrosoftExcelLogo size={20} /></p>
                    <img src="../../public/comp-screen-print-step-1.png" alt="" />
                    <div className="warn-info-comp-step-1">
                        <PiWarningBold style={{ color: "#e9c600ff" }} size={20} />
                        <p>Anexe a planilha MENOR no campo da ESQUERDA, e a MAIOR no campo da DIREITA. Isso evita duplas marcações.</p>
                    </div>
                </div>
                <div className="info-comp-step">
                    <p>3. Entendendo o processo <FaGears /></p>
                    <img src="../../public/comp-screen-img-step-3.png" alt="" />
                    <div className="info-comp-step-desc">
                        <p>O comparador irá mapear os dados contidos na primeira planilha e então procura-los na segunda planilha. Os itens que forem enontrados nas duas planilhas serão marcados em <span style={{ color: "green" }}>verde</span>, os que não forem encontrados serão marcados em <span style={{ color: "red" }}>vermelho</span>. A primeira planilha é a base para toda a marcação.</p>
                    </div>
                </div>
                <div className="info-comp-step">
                    <p>4. Baixando os resultados <FaFileDownload /></p>
                    <img src="../../public/comp-screen-img-step-4.png" alt="" />
                    <div className="info-comp-step-desc">
                        <p>Logo após a comparação, será feito um download com duas cópias das planilhas anexadas com as devidas marcações. O download é automático e os arquivos virão comprimidos numa pasta .zip.</p>
                    </div>
                </div>

                <div className="informacoes-importantes-comp">
                    <h4><PiWarningBold style={{ color: "#e9c600ff" }} size={20} /> Informações importantes!</h4>
                    <ul>
                        
                        <li>As planilhas devem estar no formato .xlsx (Excel).</li>
                        <li>Cada arquivo deve conter <strong>apenas uma aba principal</strong>(a primeira será usada na comparação).</li>
                        <li>As colunas que serão comparadas precisam estar <strong>na mesma estrutura em abmas as planilhas.</strong></li>
                        <li>Coloque a planilha menor (menos linhas) no campo da <strong>esquerda</strong>.</li>
                        <li>Números são comparados diretamente como texto simples.
                        Portanto, certifique-se de que o formato numérico esteja consistente entre as planilhas.</li>
                        <li>Textos são comparados sem considerar maiúscilas/minúsculas ou espaços extras.</li>
                        <li>Evite valores mistos (números com letras no mesmo campo).</li>
                        <li>O programa considera que a primeira linha é o cabeçalho, a comparação começa a partir da segunda linha.</li>
                        <li>Não altere as planilhas durante o upload.</li>
                        <li>O comparador é uma ferrameta de apoio, e não garante 100% de assertividade em casos de planilhas com formatos muito inconsistentes.</li>
                    </ul>
                </div>
                
            </div>
        </div>
    )
}

export default InfoComparador