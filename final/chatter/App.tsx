import React from "react";
import LeftSlideMenu from "./app/presentation/components/menu/leftSlideMenu";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/domain/store/store";
import AppNav from "./appNav";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppNav />

      <LeftSlideMenu />
    </ReduxProvider>
  );
}
