import { useState } from "react";
import Header from "./Component/Header";
import MainPage from "./Component/MainPage";

function App(params) {
   const [isDark, setIsDark] = useState(true);
   return(
      <>
         <div className={`${isDark ? 'dark' : ''} h-screen flex flex-col`}>
             <Header/>
             <MainPage/>
         </div>
      </>
   )
}
export default App;