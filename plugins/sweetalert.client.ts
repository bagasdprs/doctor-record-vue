import Swal from "sweetalert2";
// Import CSS-nya (Wajib biar gak berantakan)
import "sweetalert2/dist/sweetalert2.min.css";

export default defineNuxtPlugin((nuxtApp) => {
  // Kita inject $swal ke dalam aplikasi
  return {
    provide: {
      swal: Swal,
    },
  };
});
