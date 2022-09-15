export default [
  { path: "/", redirect: "/home" },
  { path: "/home", name: "Home", component: () => import('@/view/Home') },
  { path: "/video", name: "introduce", component: () => import('@/view/videoRecording') },
  { path: "/error", name: "Error", component: () => import('@/components/error/index') },
  { path: "/noLogin", name: "NoLogin", component: () => import('@/components/noLogin/index') },
  { path: "/noIdent", name: "NoIdent", component: () => import('@/components/noIdent/index') },
]
