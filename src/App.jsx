import useAppStore from './store/appStore'
import BottomNav from './components/layout/BottomNav'
import Sidebar   from './components/layout/Sidebar'
import Toast     from './components/ui/Toast'

import LoginScreen    from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import CRMScreen      from './screens/CRMScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import FinanceScreen  from './screens/FinanceScreen'
import ChatScreen     from './screens/ChatScreen'
import MoreScreen     from './screens/MoreScreen'

const SCREENS = {
  login:    LoginScreen,
  home:     DashboardScreen,
  crm:      CRMScreen,
  projects: ProjectsScreen,
  finance:  FinanceScreen,
  chat:     ChatScreen,
  more:     MoreScreen,
}

export default function App() {
  const { currentScreen, isAuthenticated } = useAppStore()

  return (
    <div className="app-shell">
      {/* Cinematic ambient atmosphere */}
      <div className="ambient-orbs" aria-hidden="true">
        {/* Violet orb — upper right */}
        <div style={{
          position:'absolute', top:'-10%', right:'10%',
          width:'45vw', height:'45vw',
          background:'radial-gradient(ellipse, rgba(124,58,237,.07) 0%, transparent 65%)',
          pointerEvents:'none',
        }}/>
      </div>

      {/* Desktop sidebar — only shown when authenticated */}
      {isAuthenticated && <Sidebar />}

      {/* Screen content — offset by sidebar on desktop */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isAuthenticated ? 'md:ml-64' : ''}`}>
        {Object.entries(SCREENS).map(([id, Screen]) => (
          <div key={id} className={`screen ${currentScreen === id ? 'screen-active' : ''}`}>
            <Screen />
          </div>
        ))}
      </div>

      {/* Mobile bottom nav */}
      {isAuthenticated && <BottomNav />}

      <Toast />
    </div>
  )
}