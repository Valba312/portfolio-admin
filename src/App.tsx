
import React from "react";
import { Route, Switch } from "wouter";
import { Portfolio } from "@/components/Portfolio";
import { AdminPanel } from "@/components/AdminPanel";
export default function App() { return (<Switch><Route path="/" component={Portfolio} /><Route path="/admin" component={AdminPanel} /><Route>404 — страница не найдена</Route></Switch>); }
