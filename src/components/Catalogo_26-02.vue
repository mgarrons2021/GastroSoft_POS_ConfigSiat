<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="formgrid grid" :style="'display: flex;width:100%;'">
          <div class="field col-9">
            <h4 :style="'text-align:left;clear: both; '">
              <span style="font-family: impact; font-size: 16px; color: black;"> Datos Factura - Nro Transaccion: </span>
              {{ this.nro_transaccion + 1 }}
            </h4>
            <!-- Add the style and icon you want using the String format -->
            <!-- <a href=""> User-secret <font-awesome-icon :icon="['fas', 'user-secret']" /></a>
               <br>
               <a href="">  Otro fa-ckeck <font-awesome-icon :icon="['fa-solid', 'fa-check']" /></a>
               <br>
               <a href="">fa-envelope-open-text <font-awesome-icon icon="fa-solid fa-envelope-open-text" /></a> -->
          </div>
          <div class="field col-3">
            <div class="modalidadoffline">
              <div class="panel-heading">
                <h5 class="panel-title">Emision Fuera de Linea</h5>
              </div>

              <div class="panel-body">
                <label class="switch">
                  <input type="checkbox" @click="toggleCheckbox()" />
                  <div class="slider round"></div>
                </label>
              </div>
            </div>
          </div>
          <br />
          <div class="field col-2" v-if="infopersonal.sucursal == 18">
            <h5 :style="'text-align:right'">
              Nro Visitas: {{ contador_visitas }}
            </h5>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-1">
            <label for="lugar">
              <span style="font-family: impact; font-size: 13px; color: black;"> Lugar: </span>
              <i lass="fa-solid fa-location-dot"></i>
            </label>
            <Dropdown v-model="optionsPlace" :options="optionsPlaces" optionLabel="name" placeholder="En Restaurante"
              @change="mostrarDeliverys()" />
          </div>
          <div class="field col-2" :style="isVisibilityDeliverys ? 'display:block' : 'display:none'">
            <label for="delivery">Delivery</label>
            <Dropdown v-model="optionsDelivery" :options="optionsDeliverys" optionLabel="delivery"
              placeholder="Pedidos Ya" />
          </div>
          <div class="field col-2">
            <label for="pago">
              <span style="font-family: impact; font-size: 13px; color: black;"> Pago </span> <font-awesome-icon
                icon="fa-solid fa-cart-shopping" />
            </label>
            <Dropdown v-model="MetodoPago" :options="MetodosPagos" optionLabel="descripcion" :placeholder="'EFECTIVO'" 
            />
          </div>
          <div class="field col-1">
            <label for="nro_tarjeta">
              <span style="font-family: impact; font-size: 13px; color: black;"> Nro Tarjeta </span><font-awesome-icon
                icon="fa-solid fa-credit-card" />
            </label>
            <InputText id="nro_tarjeta" type="text" placeholder="Nro de Tarjeta" v-model="nro_tarjeta"
               />
          </div>

          <div class="field col-2">
            <label for="lugar">
              <span style="font-family: impact; font-size: 13px; color: black;"> Tipo de Documento </span>
              <font-awesome-icon icon="fa-solid fa-address-book" />
            </label>
            <!-- dice que obtenerIdentityDocument no es una funcion, asi que será comentado de momento
              @change="obtenerIdentityDocument()"  -->

            <Dropdown v-model="documentoIdentidad" :options="documentosIdentidades" optionLabel="descripcion"
              :placeholder="'CI - CEDULA DE IDENTIDAD'" />
          </div>

          <!-- v-model="optionsPlace"
              :options="optionsPlaces"
              optionLabel="name"
              placeholder="En Restaurante" -->

          <div class="field col-1">
            <label for="nit_ci">
              <span style="font-family: impact; font-size: 13px; color: black;"> Nro de NIT/CI </span><font-awesome-icon
                icon="fa-solid fa-address-card" />
            </label>
            <InputText id="nit_ci" type="text" placeholder="Nro de Documento" v-model="nit_ci"
              v-on:keyup="searchCliente()" />
            <!-- <Button
              class="mt-2"
              label="Verificar Nit"
              icon="pi pi-check"
              size="small"
              v-on:click="verificarNit()"
            /> -->
          </div>
          <div class="field col-1">
            <label for="complemento">
              <span style="font-family: impact; font-size: 13px; color: black;"> Complemento </span><font-awesome-icon
                icon="fa-solid fa-clipboard" />
            </label>
            <InputText id="complemento" type="text" placeholder="Complemento" v-model="complemento" />
          </div>
          <div class="field col-2">
            <label for="cliente">
              <span style="font-family: impact; font-size: 13px; color: black;"> Nombre Cliente </span><font-awesome-icon
                icon="fa-solid fa-user" />
            </label>
            <InputText id="cliente" type="text" placeholder="Cliente" v-model="cliente" />
          </div>
          <!-- <div class="field col-2">
            <label for="empresa">Empresa</label>
            <InputText
              id="empresa"
              type="text"
              placeholder="Empresa"
              v-model="empresa"
            />
          </div> -->
          <!-- <div class="field col-2">
            <label for="celular">Celular</label>
            <InputText
              id="celular"
              type="text"
              placeholder="Celular"
              v-model="celular"
            />
          </div> -->
          <div class="field col-2">
            <label for="correo">
              <span style="font-family: impact; font-size: 13px; color: black;"> Correo </span><font-awesome-icon
                icon="fa-solid fa-envelope" />
            </label>
            <InputText id="correo" type="text" placeholder="Correo" v-model="correo" />
          </div>
          <div class="field col-2" :style="checkbox == true ? 'display:block' : 'display:none'">
            <label for="lugar">Seleccione la Contingencia</label>
            <Dropdown v-model="contingencia" :options="contingencias" optionLabel="descripcion"
              :placeholder="'Seleccione una contingencia'" @change="obtenerEvento()" />
          </div>
          <div class="field col-2" :style="checkbox == true ? 'display:block' : 'display:none'">
            <label for="lugar">Fecha de Emision Manual</label>
            <Calendar v-model="fecha_emision_manual" :showButtonBar="true" placeholder="Fecha Emision Manual" />
          </div>
          <div class="field col-2" :style="checkbox == true ? 'display:block' : 'display:none'">
            <label for="lugar">Hora de Emision Manual</label>
            <Calendar v-model="hora_emision_manual" :showButtonBar="true" placeholder="Hora Emision Manual"
              :timeOnly="true" />
          </div>
          <div class="field col-2" v-if="infopersonal.sucursal == 18">
            <label for="codigo">Codigo</label>
            <InputText id="codigo" type="number" placeholder="Codigo" v-model="codigo"
              v-on:keyup="searchClientePhone()" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="card">
        <span style="font-family: impact; font-size: 16px; color: black;"> Platos Ofertados</span>
        <TabMenu :model="categorias2">
          <template #item="{ item }">
            <Button class="p-button-raised p-button-info p-button-sm mr-1 mb-1"
              style="padding: 8px; margin-top: 3px; font-size: 13px" @click="onSortChange(item.id)"
              :label="item.label"></Button>
          </template>
        </TabMenu>

        <DataView :value="plates" :layout="layout" :paginator="true" :rows="24" :sortOrder="sortOrder"
          :sortField="sortField">
          <template #grid="slotProps">
            <div class="col-12 md:col-2">
              <div class="card m-1 border-1 surface-border align-items-center">
                <div class="text-center">
                  <h3>{{ slotProps.data.nombre }}</h3>

                  <img v-if="slotProps.data.imagen == null"
                    src="https://cdn0.iconfinder.com/data/icons/pixel-perfect-at-24px-volume-2/24/2034-512.png"
                    class="w-5 shadow-1" />
                  <img v-else :src="process.env.VUE_APP_URL_EERPWEBV +
                    '' +
                    slotProps.data.imagen
                    " :alt="slotProps.data.nombre" class="w-9 shadow-1" />

                  <div class="text-1xl font-bold" style="font-size: 12px">
                    {{ slotProps.data.Plato }}
                  </div>
                </div>
                <div class="flex align-items-center justify-content-center">
                  <div class="row">
                    <Button class="p-button-raised p-button-primary p-button-sm mr-1 mb-1"
                      :label="'Venta N. ' + slotProps.data.Precio + ' Bs'"
                      style="padding: 4px; margin-top: 7px; font-size: 10px"
                      v-on:click="addPlateNormal(slotProps.data)"></Button>
                    <Button class="p-button-raised p-button-info p-button-sm mr-1 mb-1" :label="'Delivery ' + slotProps.data.PrecioDelivery + ' Bs'
                      " style="padding: 4px; margin-top: 4px; font-size: 10px"
                      v-on:click="addPlateDelivery(slotProps.data)"></Button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
    <div class="col-5">
      <div class="card">
        <span style="font-family: impact; font-size: 13px; color: black;"> Detalle de Venta </span>
        <!-- :loading="loading2"
             :responsiveLayout="true"
         -->
        <DataTable :value="carrito" :scrollable="true" scrollHeight="500px" scrollDirection="both" class="mt-2"
          responsiveLayout="true">
          <Column :style="{ width: '50px' }" header=" ">
            <template #body="slotProps">
              <td style="text-align: right" class="text-bold">
                <Button icon="pi pi-times" class="p-button-danger"
                  @click="deletePlate(this.carrito.indexOf(slotProps.data))" />
              </td>
            </template>
          </Column>
          <!-- frozen -->
          <Column field="plato" header="Plato" :style="{ width: '220px' }"></Column>
          <Column field="cantidad" header="Cantidad" :style="{ width: '80px' }">
            <template #body="slotProps">
              <input type="text" :value="slotProps.data.cantidad" style="width: 100%" minlength="1" maxlength="4"
                v-on:keyup="
                  calculateSubtotal(this.carrito.indexOf(slotProps.data))
                  " />
            </template>
          </Column>
          <Column field="costo" header="Costo" :style="{ width: '70px' }">
          </Column>
          <Column field="descuento" header="Descuento" :style="{ width: '70px' }">
            <template #body="slotProps">
              <input type="number" :value="slotProps.data.descuento" style="width: 100%" v-on:keyup="calculateSubtotalDescuento(this.carrito.indexOf(slotProps.data))"/>
            </template>
          </Column>
          <Column field="subtotal" header="Sub Total" :style="{ width: '70px' }">
            <template #body="slotProps">
              <td style="text-align: right" class="text-bold">
                <!-- {{ slotProps.data.subtotal }} Bs. -->
              {{ slotProps.data.subtotal - (slotProps.data.descuento * (slotProps.data.subtotal/100)) }} Bs.
              </td>
            </template>
          </Column>
        </DataTable>

        <div class="card">
          <div class="grid">
            <div class="col-10">
              <span style="font-family: impact; font-size: 13px; color: black;"> Sub Total: </span>
            </div>
            <div class="col-2">
              <span style="font-family: impact; font-size: 13px; color: black;"> {{ this.total }} Bs. </span>
          
            </div>
          </div>
           <div class="grid">
            <div class="col-10">
              <span style="font-family: impact; font-size: 13px; color: black;"> Total Descuento x Producto: </span>
             
            </div>
            <div class="col-2">
              <span style="font-family: impact; font-size: 13px; color: black;"> {{ this.totalDescuento }} Bs. </span>
            
            </div>
          </div>

          <div class="grid">
            <div class="col-10">
            <span style="font-family: impact; font-size: 13px; color: black;"> Total Descuento: </span>
             
            </div>
           <div class="col-2">
           
              <input type="number"  style="width: 100%" v-on:keyup="calculatetotalDescuento()" /> 
                        
            </div>
          </div>
          <div class="grid">
            <div class="col-10">
              <span style="font-family: impact; font-size: 13px; color: black;"> Total Neto: </span>
            </div>
            <div class="col-2">
              <span style="font-family: impact; font-size: 13px; color: black;"> {{ this.total - this.totalDescuento -this.totalDescuentoAdicional }} Bs. </span>
              
            </div>
          </div>
          <div class="card-footer">
            <div class="field col-2">
              <Button label="Registrar Venta" class="mr-2 mb-2" v-on:click="registerSale()" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- se cambio size="200" por style="size:200px" -->
  <div id="content_qr" style="opacity: 0">
    <qrcode-vue :value="QRValue" size="200" level="L" />
  </div>
  <div id="qr_code"></div>
</template>

<script>
import { inject } from "vue";
import ProductService from "../service/ProductService";
import moment from "moment";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import downloadPDF from "../utils/FacturaPDF.js";
import downloadPDFP from "../utils/FacturaPersonal.js";
export default {
  name: "catalogo",
  data() {
    return {
      hora_emision_manual: null,
      fecha_emision_manual: null,
      categorias2: [],
      checkbox: false,
      isVisibilityDeliverys: false,
      // isVisibilityTarjeta: false,
      optionsDelivery: { name: "PedidosYa" },
      optionsDeliverys: [
        { delivery: "PedidosYa" },
        { delivery: "PatioService" },
        { delivery: "Yaigo" },
        { delivery: "MrDelivery" },
        { delivery: "Km6" },
        { delivery: "SuperHelper" },
        { delivery: "OrdenYa" },
        { delivery: "UbertEats" },
      ],
      nro_transaccion: 0,
      codigo: "",
      datos_empresa: {
        nombre: "GASTROSOFT",
        celular: "78555410",
        fecha: "2021-03-23",
        nit: "5371072016",
      },
      QRValue: "",
      optionsPlace: {
        name: "En Restaurante",
      },
      optionsPlaces: [
        { name: "En Restaurante" },
        { name: "Para Llevar" },
        { name: "Venta Externa" },
        { name: "Delivery" },
      ],
      MetodosPagos: [],
      MetodoPago: {
        codigoClasificador: 1,
        descripcion: "EFECTIVO",
      },
      dataviewValue: null,
      layout: "grid",
      sortKey: null,
      sortOrder: null,
      sortField: null,
      sortOptions: [],
      plates: [],
      ruta: process.env.VUE_APP_URL_API_REST_EERPWEBV,
      carrito: [],
      subtotal: 0,
      subtotales: [],
      total: 0,
      totalDescuento: 0,
      totalDescuentoAdicional: 0,
      totalNeto: 0,
      nit_ci: "0000",
      nro_tarjeta: null,
      complemento: "",
      cliente: "SIN NOMBRE",
      empresa: "",
      celular: "",
      correo: "system@donesco.com.bo",
      cufd: null,
      infopersonal: [],
      contador_visitas: 0,
      contingencias: [],
      documentosIdentidades: [],
      documentoIdentidad: {
        id: 1,
      },
      contingencia: null,
      masdemil: false
    };
  },
  components: {
    QrcodeVue,
  },
  setup() {
    const url = inject("url");
    return {
      url,
    };
  },
  productService: null,
  created() {
    this.productService = new ProductService();
    /*  axios
      .get(this.url + "conexion-siat")
      .then(response => {
        if(response.status == 500){
            this.toggleCheckbox()
        }else if(!response.data.return.transaccion){
            this.toggleCheckbox()
        }
      }) */
  },
  mounted() {
    this.get_transaction();
    this.authenticacion();
    this.productService
      .getProducts()
      .then((data) => (this.dataviewValue = data));
    this.getCategorias();
    this.getCufd();
    this.getEventsSignificative();
    this.getIdentityDocuments();
    this.getIdentityMetodoPago();
  },
  methods: {
    authenticacion() {
      if (
        localStorage.getItem("User") == null ||
        localStorage.getItem("User") == "undefined"
      ) {
        this.$router.push("/login");
      } else {
        this.infopersonal = JSON.parse(localStorage.getItem("User"));
      }

      if (
        localStorage.getItem("turnoId") == null ||
        localStorage.getItem("turnoId") == "undefined"
      ) {
        this.$router.push("/turno");
      } else {
        let result = axios
          .get(
            this.url +
            "verified_turn?id_turno=" +
            JSON.parse(localStorage.getItem("turnoId"))
          )
          .then((res) => {
            if (res.data.success == false) {
              this.$router.push("/turno");
            } else {
              if (localStorage.getItem("Orden") == null) {
                localStorage.setItem("Orden", 1);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updateTotal() {
      this.total = 0;
      this.totalNeto = 0;
      for (let i = 0; i < this.carrito.length; i++) {
        this.total += parseFloat(this.carrito[i].subtotal);
      }
      this.total = this.total.toFixed(2);
      if (this.total > 1000) {
        if (!this.masdemil) {
          this.$swal.fire({
            title: "Estas Seguro?",
            text: "Estas a punto de hacer una de venta de: " + this.total + "Bs",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, deseo continuar!",
            cancelButtonText: "No, cancelar transacción!",
            reverseButtons: true,
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.$swal.fire(
                  "Continuar!",
                  "la transaccion continuará.",
                  "success"
                );
                this.masdemil = true;
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === this.$swal.DismissReason.cancel
              ) {
                this.$swal.fire(
                  "Cancelado!!",
                  "Revise si el total de la venta es correcto",
                  "error"
                );
                return;
              }
            });
        }
      }
    },
    updateTotalDescuento() {
      this.totalDescuento = 0;
      for (let i = 0; i < this.carrito.length; i++) {
        this.totalDescuento += parseFloat(this.carrito[i].descuento)* (this.carrito[i].subtotal / 100).toFixed(2);
      }
      this.totalDescuento = this.totalDescuento.toFixed(2);
    },
    updateTotalDescuento2() {
      this.totalDescuentoAdicional = 0;
      //let total_actual = this.total;
      this.totalDescuentoAdicional += parseFloat(this.descuento_adicional) * (this.total/100).toFixed(2); 
      this.totalDescuentoAdicional = this.totalDescuentoAdicional.toFixed(2);
    },
    getEventsSignificative() {
      ///getSignifficantEvents
      let result = axios
        .get(this.url + "getSignifficantEvents")
        .then((res) => {
          //console.log(res.data.events);
          this.contingencias = res.data.events;
          /*  console.log(this.contingencias); */
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIdentityDocuments() {
      let result = axios
        .get(this.url + "getIdentityDocuments")
        .then((res) => {
          //tipos de identificacion
          console.log(res.data.documentosIdentidades);
          this.documentosIdentidades = res.data.documentosIdentidades;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIdentityMetodoPago() {
      let result = axios
        .get(this.url + "getIdentityMetodoPago")
        .then((res) => {
          //tipos de identificacion
          console.log(res.data.MetodosPagos);
          this.MetodosPagos = res.data.MetodosPagos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    calculateSubtotal: function (id) {
   
      let cantidad = (this.carrito[id].cantidad = event.target.value);

      console.log(cantidad);
      if (cantidad == ".") {
        console.log("Coloco un punto por delante");
        this.carrito[id].cantidad = "0.";
        cantidad = this.carrito[id].cantidad;
      }
      console.log("Nueva cantidad", cantidad);
      let subtotal_parse = this.redondear(
        Number(this.carrito[id].cantidad).toFixed(2) * this.carrito[id].costo
      );
      console.log("Sub Totales", subtotal_parse);
      let subtotal_parse_float = parseFloat(subtotal_parse);
      this.carrito[id].subtotal = subtotal_parse_float.toFixed(2) ;
      this.updateTotal();
    },
     calculateSubtotalDescuento: function (id) {
      this.carrito[id].descuento = event.target.value;
     
      this.updateTotalDescuento();
     },
     calculatetotalDescuento: function () {
      this.descuento_adicional = event.target.value;
   
      this.updateTotalDescuento2();
   
     },
    
    onSortChange(categoria_id) {
      this.getPlates(categoria_id);
    },
    getCategorias() {
      let result = axios
        .get(
          this.url +
          "getCategories?" +
          "sucursal_id=" +
          JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((res) => {
          this.sortOptions = res.data.categorias;
          for (let i = 0; i < res.data.categorias.length; i++) {
            let element = res.data.categorias[i];
            this.categorias2.push({
              id: element.id,
              label: element.nombre,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPlates(id) {
      let result = axios
        .get(
          this.url +
          "getPlates?" +
          "categoria_plato_id=" +
          id +
          "&sucursal_id=" +
          JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((res) => {
          console.log(res);
          if (res.data.plate.length > 0) {
            this.plates = res.data.plate;
          } else {
            this.plates = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addPlateNormal(data) {
      console.log(data);
      this.carrito.push({
        plato_id: data.id,
        plato: data.Plato,
        plato_categoria_id: data.idCategoria,
        cantidad: 0,
        descuento: 0,
        descuento_adicional: 0,
        costo: data.Precio,
        subtotal: 0,
      });
    },
    addPlateDelivery(data) {
      this.carrito.push({
        plato_id: data.id,
        plato: data.Plato,
        plato_categoria_id: data.idCategoria,
        cantidad: 0,
        descuento: 0,
        descuento_adicional: 0,
        costo: data.PrecioDelivery,
        subtotal: 0,
      });
    },
    deletePlate(id) {
      this.carrito.splice(id, 1);
      this.updateTotal();
    },
    totalVents(price) {
      return price + 1;
    },
    verificarNit() {
      let datito = {
        id_sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
        ci_nit: this.nit_ci.toString(),
      };
      if (this.documentoIdentidad.id == 5) {
        this.$swal.fire({
          title: "Verificando NIT ...",
          allowEscapeKey: false,
          icon: "info",
          allowOutsideClick: false,
          background: "#19191a",
          showConfirmButton: false,
          onOpen: () => {
            this.$swal.showLoading();
          },
        });
        axios.post(this.url + "verificar_nit", datito).then((res) => {
          if (res.data.respuesta.codigo != 986) {
            this.mostrarAlert(
              res.data.respuesta.codigo,
              res.data.respuesta.descripcion
            );
            return;
          } else {
            this.$swal.close();
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: "Codigo Estado: " + res.data.respuesta.codigo,
              text: "Codigo Descripcion: " + res.data.respuesta.descripcion,
              showConfirmButton: true,
            });
            this.documentoIdentidad.id = 1;
            return;
          }
        });
      } else {
        this.mostrarAlert("ADVERTENCIA", "SELECCIONE TIPO DE DOCUMENTO NIT");
        return;
      }
    },
    registerSale() {
      //  let fecha = new Date();
      //   let fecha_actual = this.parseFecha(fecha);
      //   let fecha_prueba = moment().format("dddd");
      /* console.log("patrick" + fecha_prueba); */

      let fecha_emision_manual_2;
      let hora_emision_manual_2;
      if (
        this.fecha_emision_manual != null &&
        this.hora_emision_manual != null
      ) {
        fecha_emision_manual_2 = moment(this.fecha_emision_manual).format(
          "Y-MM-DD"
        );
        hora_emision_manual_2 = moment(this.hora_emision_manual).format(
          "HH:mm:ss"
        );
      } else {
        fecha_emision_manual_2 = this.fecha_emision_manual;
        hora_emision_manual_2 = this.hora_emision_manual;
      }

      let turno_id = localStorage.getItem("turnoId");
      let datos_de_venta;
      let eventoid = this.contingencia === null ? null : this.contingencia.id;
      let identity_document_id = this.documentoIdentidad.id;
      // let tipo_pago_id = this.MetodoPago.descripcion;

      this.$swal.fire({
        title: "Registrando la venta ...",
        allowEscapeKey: false,
        icon: "info",
        allowOutsideClick: false,
        background: "#19191a",
        showConfirmButton: false,
        onOpen: () => {
          this.$swal.showLoading();
        },
      });

      if ([this.cliente, this.nit_ci, this.correo].includes("")) {
        if (this.nit_ci == "") {
          this.mostrarAlert(
            "¡Olvidaste Poner el Documento Del Cliente",
            "El dato del documento CI/NIT se encuentra vacio"
          );
          return;
        }
        console.log("Alguno es vacio");
        if (this.cliente === "") {
          this.mostrarAlert(
            "¡Olvidaste Poner el Nombre del Cliente!",
            "El nombre del cliente se encuentra vacio"
          );
          return;
        }
        if (this.correo == "") {
          
          this.mostrarAlert(
            "¡Olvidaste Poner el Correo del Cliente!",
            "El correo del cliente se encuentra vacio"
          );
          return;
        }
      } else {
        datos_de_venta = {
          correo: this.correo,
          cliente: this.cliente.toUpperCase(),
          nit_ci: this.nit_ci == "" ? "0" : this.nit_ci.toString(),
          complemento: this.complemento,
          nro_factura: this.cufd.numero_factura + 1,
          empresa: this.empresa == "" ? "SIN EMPRESA" : this.empresa,
          telefono: this.celular == "" ? 0 : this.celular,
          delivery: this.optionsDelivery.delivery,
          total_venta: this.total,
          numero_tarjeta: this.nro_tarjeta,
          total_descuento: this.totalDescuento,
          total_descuento_adicional: this.totalDescuentoAdicional,
          tipo_pago: this.MetodoPago.descripcion,
          tipo_pago_codigo: this.MetodoPago.codigoClasificador,
          lugar: this.optionsPlace.name,
          turno_id: turno_id,
          user_id: JSON.parse(localStorage.getItem("User")).user_id,
          sucursal_nombre: JSON.parse(localStorage.getItem("User"))
            .sucursal_nombre,
          detalle_venta: this.carrito,
          qr: this.QRValue,
          sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
          orden: localStorage.getItem("Orden"),
          evento_significativo_id: eventoid,
          fecha_emision_manual: fecha_emision_manual_2,
          hora_emision_manual: hora_emision_manual_2,
          documento_identidad_id: identity_document_id,
        };
      }

      console.log("paso");
      if (this.MetodoPago.descripcion == "Comida Personal") {
        axios
          .post(this.url + "sale_register_comida_personal", datos_de_venta)
          .then((resultado) => {
            console.log(resultado);
            this.sale_personal(datos_de_venta, 0);
            let ord = localStorage.getItem("Orden");
            //limpiar input
            localStorage.setItem("Orden", Number(ord) + 1);
            this.carrito = [];
            this.totalDescuento = 0;
            this.totalNeto = 0;
            this.total = 0;
            this.cliente = "";
            this.nit_ci = "";
            this.empresa = "";
            this.celular = "";
            this.correo = "";
            this.$swal.close();
          });
      } else {
        let tiene_producto_no_autorizado = false;
        this.carrito.map((value) => {
          if (
            value.plato_categoria_id == 12 ||
            value.plato_categoria_id == 17
          ) {
            tiene_producto_no_autorizado = true;
          }
        });

        // if (this.optionsPayment.name == "Comida Personal") {
        //       axios
        //         .post(this.url + "sale_register_comida_personal", datos_de_venta)
        //         .then((resultado) => {
        //           console.log(resultado);
        //           this.sale_personal(datos_de_venta, 0);
        //           let ord = localStorage.getItem("Orden");
        //           //limpiar input
        //           localStorage.setItem("Orden", Number(ord) + 1);
        //           this.carrito = [];
        //           this.totalDescuento = 0;
        //           this.totalNeto = 0;
        //           this.total = 0;
        //           this.cliente = "";
        //           this.nit_ci = "";
        //           this.empresa = "";
        //           this.celular = "";
        //           this.correo = "";
        //           this.$swal.close();
        //         });
        //     } else {
        //       let tiene_producto_no_autorizado = false;
        //       this.carrito.map((value) => {
        //         if (
        //           value.plato_categoria_id == 12 ||
        //           value.plato_categoria_id == 17
        //         ) {
        //           tiene_producto_no_autorizado = true;
        //         }
        //       });

        // console.log(
        //   "Valor actual  de la Bandera",
        //   tiene_producto_no_autorizado
        // );
        if (tiene_producto_no_autorizado) {
          //AVISAR Q DEBE SELECCIONAR TIPO DE VENTA COMIDA PERSONAL
          console.log("DEBE SELECCIONA TIPO DE VENTA COMIDA PERSONAL");
          this.$swal.close();
          this.$swal.fire({
            position: "center",
            imageUrl:
              "https://media.tenor.com/cJgdiR9snJUAAAAC/annoyed-disappointed.gif",
            imageWidth: 400,
            imageHeight: 200,
            title: "Advertencia",
            text: "DEBE SELECCIONA PAGO COMIDA PERSONAL!!",
            showConfirmButton: true,
            timer: 5000,
          });
        } else {
          console.log("REALIZAR LA VENTA DIFERENTE DE COMIDA PERSOAL");
          console.log(this.cufd.numero_factura);
          console.log(datos_de_venta);
          //validaciones
          console.log("continua");
          if (!this.validEmail(this.correo)) {
            console.log("Correo Invalido");
            this.mostrarAlert(
              "CORREO INVALID",
              "Agregue un correo valido por favor"
            );
            return;
          }
          if (datos_de_venta.detalle_venta.length == 0) {
            console.log("NO COLOCO NINGUN DETALLE");
            console.log(this.correo);
            this.mostrarAlert(
              "NO COLOCO NINGUN DETALLE",
              "Agregue Algun detalle por favor"
            );
            return;
          }
          if (datos_de_venta.documento_identidad_id == 5) {
            let arreglo = datos_de_venta.cliente.split(" ");
            console.log(arreglo.length);
            if (arreglo.length < 1) {
              this.mostrarAlert(
                "NOMBRE INVALIDO",
                "Debe Colocar Nombres y Un Apellido"
              );
              return;
            }
          }
          if (datos_de_venta.nit_ci == "5371072016") {
            this.mostrarAlert(
              "NIT DE LA EMPRESA GASTROSOFT",
              "Este NIT no está autorizado para facturar"
            );
            return;
          }
          if (this.existeDetalleZero(datos_de_venta.detalle_venta)) {
            console.log("Algun detallle tiene cantidad 0");
            this.mostrarAlert(
              "ALGUN DETALLE TIENE CANDIDAD 0",
              "Agregue una cantidad validad por favor"
            );
            return;
          }
          axios
            .post(this.url + "sale_register", datos_de_venta)
            .then((result) => {
              console.log(result.data);
              let visitas = result.data.cantidad_visitas;
              console.log("Estatus: ", result.data.status);
              if (result.data.status) {
                let cuf = result.data.cuf;
                let leyenda = result.data.leyenda.descripcion_leyenda;
                let idcliente = result.data.idcliente;
                let nro_factura = result.data.nro_factura;
                let punto_venta = result.data.venta.punto_venta;
                // let urlSiat = "https://siat.impuestos.gob.bo";
                let urlSiat = "https://pilotosiat.impuestos.gob.bo";
                (datos_de_venta.nro_factura = nro_factura),
                  console.log(
                    "datos para el QR:",
                    this.datos_empresa.nit,
                    cuf,
                    nro_factura
                  );

                this.QRValue =
                  urlSiat + "/consulta/QR?nit=" +
                  this.datos_empresa.nit +
                  "&cuf=" +
                  cuf +
                  "&numero=" +
                  nro_factura +
                  "&t=" +
                  1;
                this.get_transaction();
                //viendo resulatdo de la respuesta de facturacion
                console.log(result);
                if (result.data.response_siat != "undefined") {
                  this.$swal.close();
                  this.$swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Venta Registrada Exitosamente",
                    text: "Emitida Fuera de Linea",
                    showConfirmButton: true,
                    timer: 5000,
                  });
                }
                // console.log(
                //   result.data.response_siat.RespuestaServicioFacturacion.codigoEstado
                // );

                let response_siat = result.data.response_siat
                  ? result.data.response_siat.RespuestaServicioFacturacion
                  : "";
                this.$swal.close();

                if (response_siat != "") {
                  console.log(
                    result.data.response_siat.RespuestaServicioFacturacion
                  );
                  if (response_siat.codigoEstado == 908) {
                    this.$swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Codigo Estado: " + response_siat.codigoEstado,
                      text:
                        "Codigo Descripcion: " +
                        response_siat.codigoDescripcion,
                      showConfirmButton: true,
                    });
                  } else if (response_siat.codigoEstado == 902) {
                    this.$swal.fire({
                      position: "center",
                      icon: "error",
                      title: response_siat.codigoEstado,
                      text:
                        response_siat.codigoDescripcion +
                        ' "' +
                        response_siat.mensajesList.descripcion +
                        '"',
                      showConfirmButton: true,
                    });
                  } else {
                    this.$swal.fire({
                      position: "center",
                      icon: "error",
                      title: response_siat.codigoEstado,
                      text:
                        response_siat.codigoDescripcion +
                        ' "' +
                        response_siat.mensajesList.descripcion +
                        '"',
                      showConfirmButton: true,
                    });
                  }
                  // Despues lo muevo adentro porque response_siat = "";

                  if (
                    result.data.response_siat.RespuestaServicioFacturacion
                      .codigoEstado === 902
                  ) {
                    return;
                  }
                  if (
                    result.data.response_siat == "undefined" &&
                    result.data.response_siat.RespuestaServicioFacturacion
                      .codigoEstado !== 902
                  ) {
                    setTimeout(function () {
                      downloadPDF(
                        datos_de_venta,
                        this.cufd,
                        visitas,
                        cuf,
                        idcliente,
                        leyenda,
                        punto_venta
                      );
                    }, 100);
                  }
                }
                setTimeout(function () {
                  downloadPDF(
                    datos_de_venta,
                    this.cufd,
                    visitas,
                    cuf,
                    idcliente,
                    leyenda,
                    punto_venta
                  );
                }, 50);
                let ord = localStorage.getItem("Orden");
                localStorage.setItem("Orden", Number(ord) + 1);
                this.carrito = [];
                this.totalDescuento = 0;
                this.totalNeto = 0;
                this.total = 0;
                this.cliente = "";
                this.nit_ci = "";
                this.empresa = "";
                this.celular = "";
                this.correo = "";
              } else {
                console.log(result.data.status);
                if (result.data.codigoExcepcion == 1) {
                  this.mostrarAlert(result.data.codigo, result.data.msg);
                  return;
                }
                if (result.data.codigoExcepcion == 0) {
                  this.$swal.close();
                  this.$swal.fire({
                    position: "center",
                    icon: "error",
                    title: "La venta no se registro correctamente  . . . ",
                    showConfirmButton: true,
                    timer: 4000,
                  });
                  return;
                }
                return;
              }
            }).catch((err) => {
              console.log(err);
            });
        }
      }
    },
    parseFecha(fecha) {
      let fecha_actual = fecha;
      /*   console.log(fecha.getMonth() + 1);
      console.log(fecha.getDate()); */
      if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "-" +
          "0" +
          (fecha.getMonth() + 1).toString() +
          "-" +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "-" +
          (fecha.getMonth() + 1).toString() +
          "-" +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getMonth() + 1 < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "-0" +
          (fecha.getMonth() + 1).toString() +
          "-" +
          fecha.getDate().toString();
      }

      return fecha_actual;
    },
    validEmail: function (email) {
      //eslint-disable-next-linene
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    parseFechaC_Control(fecha) {
      let fecha_actual = fecha;
      if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "0" +
          (fecha.getMonth() + 1).toString() +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          (fecha.getMonth() + 1).toString() +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getMonth() + 1 < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "0" +
          (fecha.getMonth() + 1).toString() +
          fecha.getDate().toString();
      }

      return fecha_actual;
    },
    sale_personal(datos, visitas) {
      /*    console.log("prueba"); */
      downloadPDFP(datos, visitas);
    },
    searchCliente() {
      /*   console.log(this.nit_ci); */
      if (this.nit_ci != "") {
        let result = axios
          .get(this.url + "filter_client?codigo=" + this.nit_ci)
          .then((res) => {
            let retorn = res.data;
            if (retorn.success) {
              this.celular = retorn.cliente.telefono;
              this.complemento = retorn.cliente.complemento;
              this.cliente = retorn.cliente.nombre;
              this.empresa = retorn.cliente.empresa;
              if (retorn.cliente.correo == null) {
                this.correo = "";
              } else {
                this.correo = retorn.cliente.correo;
              }
              this.contador_visitas = retorn.cliente.contador_visitas;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
              this.correo = "";
              this.contador_visitas = 0;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.celular = "";
        this.cliente = "";
        this.empresa = "";
        this.contador_visitas = 0;
      }
    },
    getCufd() {
      let sucursal_id = JSON.parse(localStorage.getItem("User")).sucursal;
      let result = axios
        .get(this.url + "getCufd?" + "sucursal_id=" + sucursal_id)
        .then((res) => {
          this.cufd = JSON.parse(res.data.cufd);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserData() { },
    redondear(monto) {
      let _monto = monto.toFixed(2);
      return _monto;
    },

    redondearCantidad(cantidad) {
      let _cantidad = cantidad.toFixed(2);
      return _cantidad;
    },

    searchClientePhone() {
      if (this.codigo != "") {
        let result = axios
          .get(this.url + "filter_client_phone?celular=" + this.codigo)
          .then((res) => {
            /*  console.log(res); */
            let retorn = res.data;
            if (retorn.success) {
              this.nit_ci = retorn.cliente.ci_nit;
              this.complemento = retorn.cliente.complemento;
              this.celular = retorn.cliente.telefono;
              this.cliente = retorn.cliente.nombre;
              this.empresa = retorn.cliente.empresa;
              this.correo = retorn.cliente.correo;
              this.contador_visitas = retorn.cliente.contador_visitas;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
              this.correo = "";
              this.contador_visitas = 0;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.celular = "";
        this.cliente = "";
        this.contador_visitas = 0;
        this.empresa = "";
      }
    },
    get_transaction() {
      let result = axios
        .get(
          this.url +
          "get_transaction?turno_id=" +
          JSON.parse(localStorage.getItem("turnoId"))
        )
        .then((res) => {
          /* console.log(res.data); */
          this.nro_transaccion = res.data.nro_transaccion;
        });
    },
    mostrarDeliverys() {
      /* console.log(this.optionsPlace.name); */

      if (this.optionsPlace.name == "Delivery") {
        this.isVisibilityDeliverys = true;
      } else {
        this.isVisibilityDeliverys = false;
      }
    },
    // mostrarTarjeta() {
    //   if (this.MetodoPago.codigoClasificador == 2) {
    //     this.isVisibilityTarjeta = true;
    //   } else {
    //     this.isVisibilityTarjeta = false;
    //   }
    // },
    toggleCheckbox() {
      this.checkbox = !this.checkbox;
      console.log(this.checkbox);
    },
    mostrarAlert(titulo, texto) {
      this.$swal.close();
      this.$swal.fire({
        icon: "error",
        title: titulo,
        text: texto,
      });
    },
    existeDetalleZero(detalles) {
      let existeZero = false;
      detalles.forEach((element) => {
        if (element.cantidad == 0) {
          existeZero = true;
        }
      });
      return existeZero;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";

body {
  text-align: center;
  background: #51c3a0;
  padding: 50px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 1.5px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: #101010;
}

input:focus+.slider {
  box-shadow: 0 0 1px #101010;
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

Input {
  background-color: #ffe5ae;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.modalidadoffline {
  display: grid;
  grid-template-columns: auto auto;
}
</style>
