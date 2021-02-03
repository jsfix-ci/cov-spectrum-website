import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './App.css';
import { MainPage } from "./pages/MainPage";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Route, Switch, Redirect } from "react-router-dom";
import { SamplePage } from "./pages/SamplePage";
import { EmbedPage } from "./pages/EmbedPage";
import { LoginPage } from "./pages/LoginPage";


function App() {
  return (
    <Switch>
      <Route path="/embed/:widget"><EmbedPage/></Route>
      <Route path="/"><MainApp/></Route>
    </Switch>


  );
}


function MainApp() {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path="/"><Redirect to="/variant"/></Route>
        <Route path="/login"><LoginPage/></Route>
        <Route path="/variant"><MainPage/></Route>
        <Route path="/sample"><SamplePage/></Route>
      </Switch>
      <Footer/>
    </div>
  );
}


export default App;