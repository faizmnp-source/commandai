import useAppStore from './store/appStore'
import BottomNav   from './components/layout/BottomNav'
import Sidebar     from './components/layout/Sidebar'
import RightPanel  from './components/layout/RightPanel'
import Toast       from './components/ui/Toast'

import LoginScreen     from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import CRMScreen       from './screens/CRMScreen'
import ProjectsScreen  from './screens/ProjectsScreen'
import FinanceScreen   from './screens/FinanceScreen'
import ChatScreen      from './screens/ChatScreen'
import MoreScreen      from './screens/MoreScreen'

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
    <>
      {/* Fixed atmospheric background — glass cards blur against this */}
      <div className="app-bg" aria-hidden="true" />

      <div className="app-shell" style={{ position: 'relative', zIndex: 1 }}>
        {isAuthenticated && <Sidebar />}

        {/* Center content — offset left for sidebar, right for cinematic panel */}
        <div className={`flex-1 flex flex-col overflow-hidden ${isAuthenticated ? 'md:ml-64 md:mr-[272px]' : ''}`}>
          {Object.entries(SCREENS).map(([id, Screen]) => (
            <div key={id} className={`screen ${currentScreen === id ? 'screen-active' : ''}`}>
              <Screen />
            </div>
          ))}
        </div>

        {isAuthenticated && <RightPanel />}
        {isAuthenticated && <BottomNav />}
        <Toast />
      </div>
    </>
  )
}
