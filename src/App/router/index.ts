import loadable from "@/App/utils/loadable";

const ChatContent = loadable(() => import('@/App/pages/ChatContent'));

interface Route {
  path: string,
  exact: boolean,
  auth: boolean,
  component: any
}

const routes: Array<Route> = [
  {path: '/', exact: true, auth: true, component: ChatContent},
];

export default routes;
