export default defineNuxtRouteMiddleware((to, from) => {
  // Sementara kita log aja dulu, jangan redirect aneh-aneh
  console.log("Middleware running at", to.path);
});
