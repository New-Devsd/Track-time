import Vue from 'vue';
import Vuetify from 'vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);

export default new  Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
});