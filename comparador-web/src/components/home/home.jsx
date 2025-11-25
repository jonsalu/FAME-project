import React from "react";
import { GrCompare } from "react-icons/gr";
import { TbRowRemove } from "react-icons/tb";
import { GrLink } from "react-icons/gr";

import { GoMirror } from "react-icons/go";


import { Link } from "react-router-dom";
import './home.css'

function Home() {
  return (
    <div className="home">
        
            
               <div className="grid-services">
                    <div className="linha-1-home">
                        <div className="card-service">
                            <div className="card-title">
                            <GrCompare size={40} style={{ color: "#001A72"}}/> <h4>Comparar Planilhas</h4>
                            </div>
                            <p>Comparar 2 planilhas e marcar os itens que estiverem presentes nas duas planilhas</p>
                            <Link to={"/upload"} className="btn-link-home">
                                Abrir
                            </Link>
                        </div>
                        <div className="card-service">
                            <div className="card-title">
                            <TbRowRemove size={40} style={{ color: "#001A72"}}/> <h4>Valores Faltantes</h4>
                            </div>
                            <p>Detectar linhas com células vazias simultaneamente</p>
                            <Link to={"/celulas-vazias"} className="btn-link-home">
                                Abrir
                            </Link>
                        </div>
                        <div className="card-service">
                            <div className="card-title">
                            <GoMirror size={40} style={{ color: "#001A72"}}/> <h4>Detectar Duplicatas</h4>
                            </div>
                            <p>Detectar valores duplicados em colunas específicas</p>
                            <Link to={"/duplicatas"} className="btn-link-home">
                                Abrir
                            </Link>
                        </div>
                        <div className="card-service">
                            <div className="card-title">
                            <GrLink size={40} style={{ color: "#001A72"}}/> <h4>União Inteligente</h4>
                            </div>
                            <p>Unir valores de diferentes planilhas baseado numa coluna em comum</p>
                            <Link to={"/uniao-inteligente"} className="btn-link-home">
                                Abrir
                            </Link>
                        </div>
                    </div>
               </div>
      
      
    </div>
  );
}

export default Home;
