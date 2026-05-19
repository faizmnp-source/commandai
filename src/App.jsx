import useAppStore from './store/appStore'
import BottomNav from './components/layout/BottomNav'
import Toast from './components/ui/Toast'

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
      {Object.entries(SCREENS).map(([id, Screen]) => (
        <div key={id} className={`screen ${currentScreen === id ? 'screen-active' : ''}`}>
          <Screen />
        </div>
      ))}
      {isAuthenticated && <BottomNav />}
      <Toast />
    </div>
  )
}