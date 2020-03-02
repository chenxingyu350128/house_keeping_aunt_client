// import Vue from 'vue'
// import Vuetify from 'vuetify/lib'
import VuetifySnackbar from "vuetify-toast-snackbar";
// import "vuetify/dist/vuetify.min.css";
Vue.use(Vuetify)
Vue.use(VuetifySnackbar, {
  x: "right", // default
  y: "bottom", // default
  color: "grey darken-1", // default
  icon: "mdi-information",
  classes: ["body-2"],
  dismissable: true, // default
  multiLine: false, // default
  vertical: false, // default
  queueable: false, // default
  showClose: false, // default
  shorts: {
    custom: {
      color: "primary"
    }
  },
  property: "$toast" // default
});

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#06C1AE",
        secondary: "#424242",
        blue: '#00aaef',
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#00aaef",
        success: "#4CAF50",
        warning: "#FFC107",
        light_grey: '#f4f4f4'
      }
    }
  },
  icons: {
    iconfont: ["mdi"]
  }
})
