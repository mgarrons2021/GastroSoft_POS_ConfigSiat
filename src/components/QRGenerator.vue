<template>
<div>
<form >
    <input type="text" v-model="QRValue">
</form>
   <qrcode-vue v-if="QRValue" :value="QRValue" size=80 level="H" />
</div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
export default {
    data(){
        return{
          QRValue:null,
        }
    },
    components:{
        QrcodeVue
    }
}
</script>