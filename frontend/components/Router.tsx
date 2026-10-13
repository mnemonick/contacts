import { StrictMode } from "react";
import { Route, Switch } from "wouter";
import NotFoundRoute from "#/components/routes/NotFoundRoute.tsx";
import UserRoute from "#/components/routes/UserRoute.tsx";
import GuestRoute from "#/components/routes/GuestRoute.tsx";
import Disconnected from "#/components/Disconnected.tsx";
import ErrorScreen from "#/components/ErrorScreen.tsx";
import Styles from "#/components/Styles.tsx";
import useGlobalStore from "#/stores/useGlobalStore.ts";

export default function () {
  const disconnected = useGlobalStore((store) => store.disconnected);
  const error = useGlobalStore((store) => store.error);

  let content = (
    <Switch>
      <Route path="/" component={GuestRoute} />
      <Route path="/user" component={UserRoute} />
      <Route>
        <NotFoundRoute />
      </Route>
    </Switch>
  );

  if (disconnected) content = <Disconnected />;
  if (error) content = <ErrorScreen />;

  return (
    <StrictMode>
      <Styles />
      {content}
    </StrictMode>
  );
}
