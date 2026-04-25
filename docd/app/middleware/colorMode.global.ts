export default defineNuxtRouteMiddleware((to) => {
  const appConfig = useAppConfig();
  const forced = appConfig.docd.ui?.colorMode;

  if (forced === "light" || forced === "dark") {
    to.meta.colorMode = forced;
  }
});
