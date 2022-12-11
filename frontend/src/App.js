import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Navigation from './components/Navigation';
import SignupFormPage from './components/SignupFormPage';
import { restoreUser } from './store/session';

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  // Check if there is a session user logged in
  useEffect(() => {
    dispatch(restoreUser())
      .then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <>
      <Navigation />
      <Switch>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
