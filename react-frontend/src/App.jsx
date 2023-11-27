import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CompleteStatCategories from "./components/CompleteStatCategories"
import Navbar from "./components/Navbar"
import { StatsLeadingCards } from "./components/StatsLeadingCards"
import CompletePlayerStatsTable from "./components/CompletePlayerStatsTable"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import persistStore from "redux-persist/es/persistStore"
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  let Persistor = persistStore(store, {timeout: 10000});

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={Persistor}> */}
        <div className='bg-zinc-800 h-full w-screen'>
          <Navbar />
            <Routes>
            <Route exact path="/nba/stats/:tableType/:stat" element={<CompletePlayerStatsTable />} />
              <Route path="/" element={
                <>
                  <CompleteStatCategories />
                  <StatsLeadingCards />
                </>
              }>
              </Route>
            </Routes>
        </div>
      {/* </PersistGate> */}
    </Provider>
  )
}

export default App
