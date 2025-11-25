import Header from './components/header/header'
import './App.css'
import UploadForm from './components/form/UploadForm'
import { Route, Routes } from 'react-router-dom'
import Home from './components/home/home'
import CelulasVazias from './components/celulas_vazias/celulas_vazias'
import DadosDuplicados from './components/dados_duplicados/dados-duplicados'
import UniaoInteligente from './components/uniao_inteligente/uniao_inteligente'
import Informacao from './components/informacao/Informacao'
import InfoComparador from './components/info_comparador/info_comparador'
import InfoCelulasVazias from './components/info_valores_faltantes/info_cv'
import InfoDuplicatas from './components/info_duplicatas/info_duplicatas'
import InfoUniaoInteligente from './components/info_uniao/info_uniao_inteligente'
import Footer from './components/footer/footer'


function App() {
  

  return (
    <div className="app">
      <Header/>
      
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/upload" element={<UploadForm/>} />
        <Route path='/celulas-vazias' element = {<CelulasVazias/>} />
        <Route path='/duplicatas' element={<DadosDuplicados />} />
        <Route path='/uniao-inteligente' element={<UniaoInteligente />} />
        <Route path='/informacao-geral' element={<Informacao/>} />
        <Route path='/info-comparador' element={<InfoComparador/>}/>
        <Route path='/info-celulas-vazias' element={<InfoCelulasVazias/>}/>
        <Route path='/info-duplicatas' element={<InfoDuplicatas/>}/>
        <Route path='/info-uniao' element = {<InfoUniaoInteligente/>}/>
      </Routes>
      
      <Footer/>
      

      
    </div>
    
  )
}

 

export default App
