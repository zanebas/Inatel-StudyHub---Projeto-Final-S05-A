import { useEffect } from 'react'
import { useApp } from './context/AppContext.jsx'
import Login from './components/Login.jsx'
import Toast from './components/Toast.jsx'
import InatelHeader from './components/appInatel/InatelHeader.jsx'
import InatelBottomNav from './components/appInatel/InatelBottomNav.jsx'
import AvisosTab from './components/appInatel/AvisosTab.jsx'
import HorariosTab from './components/appInatel/HorariosTab.jsx'
import NotasTab from './components/appInatel/NotasTab.jsx'
import MenuTab from './components/appInatel/MenuTab.jsx'
import StudyHub from './pages/StudyHub.jsx'
import Filtro from './pages/Filtro.jsx'
import Confirmacao from './pages/Confirmacao.jsx'
import MinhaReserva from './pages/MinhaReserva.jsx'

const TELAS = {
  avisos: { titulo: 'Avisos', aba: 'avisos', Tela: AvisosTab },
  horarios: { titulo: 'Horários', aba: 'horarios', Tela: HorariosTab },
  notas: { titulo: 'Notas', aba: 'notas', Tela: NotasTab },
  menu: { titulo: 'Menu', aba: 'menu', Tela: MenuTab },
  studyhub: { titulo: 'StudyHub', aba: 'studyhub', Tela: StudyHub },
  filtro: { titulo: 'StudyHub', aba: 'studyhub', Tela: Filtro, modulo: true },
  confirmacao: { titulo: 'StudyHub', aba: 'studyhub', Tela: Confirmacao, modulo: true },
  reserva: { titulo: 'StudyHub', aba: 'studyhub', Tela: MinhaReserva, modulo: true },
}

export default function App() {
  const { autenticado, pagina, setPagina } = useApp()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pagina])

  if (!autenticado) return <Login />

  // 'inicio' (destino padrão pós-login) abre a primeira aba do app
  const { titulo, aba, Tela, modulo } = TELAS[pagina] ?? TELAS.avisos

  return (
    <div className="dark inatel-app">
      <InatelHeader titulo={titulo} />
      <main className="inatel-container inatel-content">
        {modulo ? (
          <div className="inatel-studyhub-content"><Tela /></div>
        ) : (
          <Tela />
        )}
      </main>
      <InatelBottomNav ativa={aba} onSelect={setPagina} />
      <Toast />
    </div>
  )
}
