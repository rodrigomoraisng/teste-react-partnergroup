import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from './components/AsyncComponent';

const AsyncUsuario = asyncComponent(() => import('./User'));

export default (childProps) =>
  <BrowserRouter>
    <Switch>
      <Route path="/usuarios" exact props={childProps} component={AsyncUsuario} />
      <Route path="/usuarios/novo" exact props={childProps} component={AsyncUsuario} />
      <Route path="/usuarios/:id" exact props={childProps} component={AsyncUsuario} />
      <Route render={() => ((<Redirect to="/usuarios"/>))}/>
    </Switch>
  </BrowserRouter>