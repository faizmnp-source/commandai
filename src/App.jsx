import useAppStore from './store/appStore'
import BottomNav from './components/layout/BottomNav'
import Toast from './components/ui/Toast'

import LoginScreen   from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import CRMScreen     from './screens/CRMScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ChatScreen    from './screens/ChatScreen'
import MoreScreen    from './screens/MoreScreen'

const SCREENS = {
  login:    LoginScreen,
  home:     DashboardScreen,
  crm:      CRMScreen,
  projects: ProjectsScreen,
  chat:     ChatScreen,
  more:     MoreScreen,
}

export default function App() {
  const { currentScreen, isAuthenticated } = useAppStore()

  return (
    <div className="app-shell">

      {/* Render all screens, show/hide via CSS */}
      {Object.entries(SCREENS).map(([id, Screen]) => (
        <div
          key={id}
          className={`screen ${currentScreen === id ? 'screen-active' : ''}`}
          style={{ overflow: id === 'chat' ? 'hidden' : 'hidden' }}
        >
          <Screen />
        </div>
      ))}

      {/* Bottom nav — hidden on login */}
      {isAuthenticated && <BottomNav />}

      {/* Global toast */}
      <Toast />
    </div>
  )
}
