<template>
	<div class="grid">
		<div class="col-12 md:col-6">
			<div class="card p-fluid">
				<h5>Vertical</h5>
				<div class="field">
					<label for="name1">Name</label>
					<InputText id="name1" type="text" />
				</div>
				<div class="field">
					<label for="email1">Email</label>
					<InputText id="email1" type="text" />
				</div>
				<div class="field">
					<label for="age1">Age</label>
					<InputText id="age1" type="text" />
				</div>

				<!-- <div v-for="plate in plates" >

				</div> -->

				<li v-for="plate in plates" v-bind:key="plate">
					{{plate.Plato}}
					<img  :src="ruta+''+ plate.imagen"   >
				</li>

				<!-- Llamo a Mi API Platos -->
				<Button v-on:click="getPlates" > Listar Platos</Button>
			</div>
		</div>
	</div>
</template>

<!-- I must add the script part, in order to call back from my button upthere -->
<script>
import axios from "axios";
//import api_eerpwebv from './api.js';

    export default {
        name: "ApiDemo",
		data() {
			return {
				plates: '',
				// ruta: 'http://sistema.donesco.com.bo/',
				// ruta: 'http://192.168.0.150/gastrosoft-erp-web/src/public',
				ruta: process.env.VUE_APP_URL_EERPWEBV,
			}
		},
        methods: {
            getPlates(){
					let result = axios.get(process.env.VUE_APP_URL_API_REST_EERPWEBV+"getPlates?"+ 'categoria_plato_id=3')
				.then((res)=>{
					this.plates = res.data.plate;
					console.log(this.plates);
				})
				.catch((err)=>{
					console.log(err)
				})
            }
        }
    }
</script>