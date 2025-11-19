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
        <div className="container-services">
            <h3>Ferramentas de análise de dados</h3>
                <div className="services-grid">
                    <Link to= '/upload'>
                        <div className="card-service-option">
                            <GrCompare size={27}/>
                            <p>Comparador</p>
                        </div>
                    </Link>
                    <Link to = '/celulas-vazias'>
                        <div className="card-service-option">
                            <TbRowRemove size={27}/>
                            <p>Valores faltantes</p>
                        </div>
                    </Link>
                    <Link to= '/duplicatas'>
                        <div className="card-service-option">
                            <GoMirror size={27} />
                            <p>Detectar duplicatas</p>
                        </div>
                    </Link>
                    <Link to='/uniao-inteligente'>
                        <div className="card-service-option">
                            <GrLink size={27}/>
                            <p>União inteligente</p>
                        </div>
                    </Link>
                </div>
      </div>
      
    </div>
  );
}

export default Home;
