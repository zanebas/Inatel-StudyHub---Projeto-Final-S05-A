import { useApp } from './context/AppContext.jsx'
import Login from './components/Login.jsx'
import Shell from './components/Shell.jsx'
import StudyHub from './pages/StudyHub.jsx'
import Filtro from './pages/Filtro.jsx'
import Confirmacao from './pages/Confirmacao.jsx'
import MinhaReserva from './pages/MinhaReserva.jsx'
import Inicio from './pages/Inicio.jsx'
import Secundaria from './pages/Secundarias.jsx'

export default function App() {
  const { autenticado, pagina } = useApp()
  if (!autenticado) return <Login />

  const telas = {
    inicio: <Inicio />,
    studyhub: <StudyHub />,
    filtro: <Filtro />,
    confirmacao: <Confirmacao />,
    reserva: <MinhaReserva />,
  }
  return <Shell>{telas[pagina] ?? <Secundaria id={pagina} />}</Shell>
}

