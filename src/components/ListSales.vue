<template>
  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <h5>Filtrar ventas</h5>
      <div class="grid">
        <div class="field col-4">
          <label for="name1">Desde</label>
          <Calendar inputId="calendar" v-model="desde"></Calendar>
        </div>
        <div class="field col-4">
          <label for="email1">Hasta</label>
          <Calendar inputId="calendar" v-model="hasta"></Calendar>
        </div>
        <div class="field col-4">
          <br />
          <Button label="Filtrar" class="col-4" style="padding: 10px; margin-top: 5px" @click="filterDates()" />
        </div>
      </div>
    </div>
  </div>

  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <DataTable :value="ventas" :scrollable="false" :paginator="true" :rows="10" scrollHeight="500px"
        scrollDirection="both" class="p-datatable-gridlines" responsiveLayout="scroll">
        <Column :style="{ width: '10px' }" header="Id" field="id">
          <template #body="slotProps">
            <a>{{ slotProps.data.id }}</a>
          </template>
        </Column>
        <Column :style="{ width: '10px' }" header="E.F." field="estado">
          <template #body="slotProps">
            <a>{{ slotProps.data.estado_emision }}</a>
          </template>
        </Column>
        <Column :style="{ width: '20px' }" header="N. Factura" field="nro_factura">
          <template #body="slotProps">
            <td style="" class="text-bold">
              {{ slotProps.data.numero_factura }}
            </td>
          </template>
        </Column>
        <Column :style="{ width: '20px' }" header="Nro T.T" field="nro_transaccion">
          <template #body="slotProps">
            <td style="" class="text-bold">
              {{ slotProps.data.nro_transaccion }}
            </td>
          </template>
        </Column>
        <Column :style="{ width: '150px' }" header="Fecha y Hora" field="fecha_venta">
          <template #body="slotProps">
            <td style="" class="text-bold">
              <a>{{ slotProps.data.fecha_venta }}
                {{ slotProps.data.hora_venta }}
              </a>
            </td>
          </template>
        </Column>
        <Column :style="{ width: '50px' }" header="Usuario" field="usuario">
          <template #body="slotProps">
            <a>{{ slotProps.data.name }}</a>
          </template>
        </Column>
        <Column field="tipo_pago" header="Tipo Pago" :style="{ width: '80px' }" frozen></Column>
        <Column :style="{ width: '50px' }" header="Turno" field="turno">
          <template #body="slotProps">
            <td style="" class="text-bold">
              {{ slotProps.data.turno == 0 ? "AM" : "PM" }}
            </td>
          </template>
        </Column>
        <Column header="Lugar" field="lugar" :style="{ width: '120px' }">
          <template #body="slotProps">
            <td style="" class="text-bold">
              {{ slotProps.data.lugar }}
            </td>
          </template>
        </Column>
        <Column field="total_venta" header="Total Venta" :style="{ width: '100px' }">
          <template #body="slotProps">
            <td>{{ parseFloat(slotProps.data.total_venta ).toFixed(2) }} Bs</td>
          </template>
        </Column>
        <Column field="total_neto" header="Total Venta Neta" :style="{ width: '100px' }">
          <template #body="slotProps">
            <td>{{ parseFloat(slotProps.data.total_neto ).toFixed(2) }} Bs</td>
          </template>
        </Column>
        <Column field="detalle" header="Detalle" :style="{ width: '20px' }">
          <template #body="slotProps">
            <td style="text-align: right" class="text-bold">
              <Button icon="pi pi-eye" class="mr-2 mb-2 p-button-success" v-on:click="showDetails(slotProps.data.id)" />
            </td>
          </template>
        </Column>
        <Column field="detalle" header="Factura" :style="{ width: '20px' }">
          <template #body="slotProps">
            <td style="text-align: right" class="text-bold">
              <Button icon="pi pi-print" class="p-button-rounded p-button-danger mr-2 mb-2" v-on:click="
                print_pdf(slotProps.data.id, slotProps.data.tipo_pago)
                " />
            </td>
          </template>
        </Column>
      </DataTable>
    </div>

    <modal :show="showModal" :datas="detail" @close="showModal = false">
      <template #header>
        <h3>DETALLE VENTA</h3>
      </template>
    </modal>
  </div>

  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <div class="grid">
        <div class="field col-2"><strong>Total Anulados</strong></div>
        <div class="field col-2">{{ totales_finales[1].toFixed(2) }} Bs.</div>
        <div class="field col-2"><strong>Total Turno</strong></div>
        <div class="field col-2">{{ totales_finales[2].toFixed(2) }} Bs.</div>
        <div class="field col-2"><strong>Comida Personal</strong></div>
        <div class="field col-2">{{ totales_finales[0].toFixed(2) }} Bs.</div>
      </div>
      <div class="grid">
        <div class="field col-10"><strong>Total</strong></div>
        <div class="field col-2">
          {{ totales_finales[2].toFixed(2) - (totales_finales[1] + totales_finales[0]) }}
          Bs.
        </div>
      </div>
    </div>
  </div>
  <!--  size="200" -->
  <div id="content_qr" style="opacity: 0">
    <qrcode-vue id="qr" :value="QRValue" size="200" level="L" />
  </div>
</template>

<script>
import ProductService from "../service/ProductService";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import Modal from "../components/Carrito.vue";
import downloadPDF from "../utils/FacturaPDF.js";
import downloadPDFP from "../utils/FacturaPersonal.js";
import generateControlCode from "../utils/CodigoControl.js";
import { inject } from "vue";

export default {
  name: "sales",
  data() {
    return {
      desde: "",
      hasta: "",
      ventas: [],
      detail: [],
      showModal: false,
      QRValue: "",
      autorizacion: null,
      totales_finales: [0, 0, 0],
      rol: 0,
    };
  },
  mounted() {
    let fecha_actual = new Date();
    this.authenticacion();
    this.getSales(
      this.formatDate(fecha_actual),
      this.formatDate(fecha_actual),
      JSON.parse(localStorage.getItem("User")).sucursal
    );
  },
  methods: {
    formatDate(date) {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    },
    authenticacion() {
      if (localStorage.getItem("User") == null) {
        this.$router.push("/login");
      } else {
        this.rol = JSON.parse(localStorage.getItem("User")).rol;
      }
    },
    getSales(inicio, fin, sucursal) {
      axios
        .get(
          `${this.url}sales_lists?fecha_inicio=${inicio}&fecha_fin=${fin}&sucursal=${sucursal}`
        )
        .then((result) => {
          if (result.data.success) {
            this.ventas = result.data.sale;

            for (let i = 0; i < this.ventas.length; i++) {
              if (this.ventas[i].tipo_pago == "Comida Personal") {
                this.totales_finales[0] += Number(this.ventas[i].total_neto);
              } else if (this.ventas[i].estado == 0) {
                this.totales_finales[1] += Number(this.ventas[i].total_neto);
              } else {
                this.totales_finales[2] += Number(this.ventas[i].total_neto);
              }
            }
          } else {
            this.ventas = [];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showDetails(id) {
      axios
        .get(this.url + "sales_lists_detail?venta_id=" + id)
        .then((result) => {
          if (result.data.success) {
            console.log(result.data);
            this.detail = result.data.sales_detail;

            this.showModal = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    filterDates() {
      let d = new Date(this.desde);
      let d1 = new Date(this.hasta);
      this.getSales(
        this.formatDate(d),
        this.formatDate(d1),
        JSON.parse(localStorage.getItem("User")).sucursal
      );
    },
    print_pdf(id_venta, tipo_pago) {
      if (tipo_pago == "Comida Personal") {
        axios
          .get(this.url + "sales_for_id_personal?id=" + id_venta)
          .then((result) => {
            if (result.data.success) {
              let cuf = result.data.ventas.cuf;
              let nro_factura = result.data.ventas.numero_factura;
              // let urlSiat = "https://siat.impuestos.gob.bo";
              let urlSiat = "https://pilotosiat.impuestos.gob.bo";
              this.QRValue =
                urlSiat + "/consulta/QR?nit=5371072016" +
                "&cuf=" +
                cuf +
                "&numero=" +
                nro_factura +
                "&t=" +
                1;
              console.log("Este es el QR linea 296: ", this.QRValue);
              console.log(result.data);
              let ventas = result.data.venta_detalle;
              let detalles = [];

              for (let i = 0; i < ventas.length; i++) {
                detalles.push({
                  cantidad: ventas[i].cantidad,
                  plato_id: ventas[i].plato_id,
                  plato: ventas[i].nombre,
                  costo: parseFloat(ventas[i].precio).toFixed(2),
                  descuento: parseFloat(ventas[i].descuento).toFixed(2),
                  descuento_adicional: parseFloat(ventas[i].descuento_adicional).toFixed(2),
                  descuento_giftcard: parseFloat(ventas[i].descuento_giftcard).toFixed(2),
                  subtotal: parseFloat(ventas[i].subtotal).toFixed(2),
                });
              }

              let datos_de_venta = {
                total_descuento_adicional:result.data.ventas.total_descuento_adicional,
                total_descuento_giftcard:result.data.ventas.total_descuento_giftcard,
                cliente: result.data.ventas.nombre,
                nit_ci: result.data.ventas.ci_nit,
                total_venta: parseFloat(result.data.ventas.total_venta).toFixed(2),
                total_neto: parseFloat(result.data.ventas.total_neto).toFixed(2),
                tipo_pago: result.data.ventas.tipo_pago,
                detalle_venta: detalles,
                fecha:
                  result.data.ventas.fecha_venta +
                  " " +
                  result.data.ventas.hora_venta,
                orden: 0,
                sucursal_nombre: result.data.ventas.sucursal,
                direccion: result.data.ventas.sucursal_direccion,
                codigo_fiscal: result.data.ventas.sucursal_codigo_fiscal,
                sucursal: result.data.ventas.sucursal,
                hora_actual: result.data.ventas.hora_venta,
              };
              //console.log(datos_de_venta) -
              downloadPDFP(datos_de_venta, 0);
            } else {
              console.log(result.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .get(this.url + "sales_for_id?id=" + id_venta)
          .then((result) => {
            if (result.data.success) {
              console.log("result de api: ", result.data);
              let punto_venta = result.data.ventas.punto_venta;
              let cuf = result.data.ventas.cuf;
              let nro_factura = result.data.ventas.numero_factura;
              let idcliente = result.data.ventas.idcliente;
              let leyenda = result.data.leyenda.descripcion_leyenda;
              let urlSiat = "https://pilotosiat.impuestos.gob.bo";
              // let urlSiat = "https://siat.impuestos.gob.bo";
              this.QRValue =
                urlSiat + "/consulta/QR?nit=5371072016" +
                "&cuf=" +
                cuf +
                "&numero=" +
                nro_factura +
                "&t=" +
                1;
              let ventas = result.data.venta_detalle;
              let detalles = [];
              for (let i = 0; i < ventas.length; i++) {
                detalles.push({
                  cantidad: ventas[i].cantidad,
                  plato: ventas[i].nombre,
                  plato_id: ventas[i].plato_id,
                  costo: parseFloat(ventas[i].precio).toFixed(2),
                  descuento: parseFloat(ventas[i].descuento).toFixed(2),
                  descuento_adicional: parseFloat(ventas[i].descuento_adicional).toFixed(2),
                  descuento_giftcard: parseFloat(ventas[i].descuento_giftcard).toFixed(2),
                  subtotal: parseFloat(ventas[i].subtotal).toFixed(2),
                  subtotal_neto: parseFloat(ventas[i].subtotal_neto).toFixed(2),
                });
              }

              let datos_de_venta = {
                fecha: result.data.ventas.fecha_venta,
                hora_actual: result.data.ventas.hora_venta,
                total_venta: result.data.ventas.total_venta,
                total_neto: result.data.ventas.total_neto,
                total_descuento: result.data.ventas.total_descuento,
                cliente: result.data.ventas.nombre,
                complemento: result.data.ventas.complemento,
                total_descuento_adicional: result.data.ventas.total_descuento_adicional,
                total_descuento_giftcard:result.data.ventas.total_descuento_giftcard,
                nit_ci: result.data.ventas.ci_nit,
                nro_factura: result.data.ventas.numero_factura,
                nro_autorizacion: result.data.ventas.nro_autorizacion,
                telefono:
                  result.data.ventas.telefono == null
                    ? 0
                    : result.data.ventas.telefono,
                tipo_pago: result.data.ventas.tipo_pago,
                detalle_venta: detalles,
                codigo_control: result.data.ventas.codigo_control,
                qr: this.QRValue,
                sucursal: result.data.ventas.sucursal,
                sucursal_nombre: JSON.parse(localStorage.getItem("User"))
                  .sucursal_nombre,
                evento_significativo_id:
                  result.data.ventas.evento_significativo_id,
              };
              let autorizacion = this.autorizacion;
              console.log(autorizacion);

              console.log(idcliente);
              setTimeout(function () {
                console.log(idcliente);
                downloadPDF(
                  datos_de_venta,
                  autorizacion,
                  0,
                  cuf,
                  idcliente,
                  leyenda,
                  punto_venta
                );
              }, 1);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  components: {
    Modal,
    QrcodeVue,
  },
  setup() {
    const url = inject("url");
    return {
      url,
    };
  },
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>
