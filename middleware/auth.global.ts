export default defineNuxtRouteMiddleware((to, _from) => {
  // Sementara kita log aja dulu, jangan redirect aneh-aneh
  console.log("Middleware running at", to.path);
});
