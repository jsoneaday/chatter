import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { Profile } from "./Profile";

export default function App() {
  return (
    <Provider store={store}>
      <Profile />
    </Provider>
  );
}
