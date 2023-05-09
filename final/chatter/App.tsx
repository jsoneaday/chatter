import React from "react";
import { useState } from "react";
import PostMessageComponent from "./app/presentation/components/messages/postMessageComponent";
import LeftSlideMenu from "./app/presentation/components/menu/leftSlideMenu";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/domain/store/store";
import AppNav from "./appNav";

export default function App() {
  const [showPostMessageComponent, setShowPostMessageComponent] =
    useState(false);

  const togglePostMessageComponent = () => {
    const currentShowInnerFullSheet = !showPostMessageComponent;
    setShowPostMessageComponent(currentShowInnerFullSheet);
  };

  return (
    <ReduxProvider store={store}>
      <AppNav />

      <LeftSlideMenu />

      <PostMessageComponent
        toggleSelf={togglePostMessageComponent}
        show={showPostMessageComponent}
      />
    </ReduxProvider>
  );
}
