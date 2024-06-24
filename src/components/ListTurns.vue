<template>
  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <h5>Filtrar Turnos</h5>
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
          <Button
            label="Filtrar"
            class="col-4"
            style="padding: 10px; margin-top: 5px"
            @click="filterDates()"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <DataTable
        :value="ventas"
        :scrollable="false"
        :paginator="true"
        :rows="10"
        scrollHeight="500px"
        scrollDirection="both"
        class="p-datatable-gridlines"
        responsiveLayout="scroll"
      >
        <Column :style="{ width: '50px' }" header="Nro" field="nro">
          <template #body="slotProps">
            <a>{{ slotProps.data.nro_registro }}</a>
          </template>
        </Column>
        <Column
          :style="{ width: '50px' }"
          header="Sucursal"
          field="sucursal_nombre"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.sucursal_nombre }}</span  >
          </template>
        </Column>
        <Column
          :style="{ width: '20px' }"
          header="Funcionario"
          field="nombre_usuario"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.nombre_usuario }}</span>
          </template>
        </Column>
        <Column :style="{ width: '50px' }" header="Fecha" field="fecha">
          <template #body="slotProps">
            <span>{{ slotProps.data.fecha }}</span>
          </template>
        </Column>
        <Column field="turno" header="Turno" :style="{ width: '50px' }" frozen>
          <template #body="slotProps">
            <span v-if="slotProps.data.turno == 0">AM</span>
            <span v-else>PM</span>
          </template>
        </Column>
        <Column field="ventas" header="Total Venta" :style="{ width: '50px' }">
          <template #body="slotProps">
            <td>{{ slotProps.data.ventas }} Bs</td>
          </template>
        </Column>
        <Column
          field="estado"
          header="Estado"
          :style="{ width: '20px' }"
          frozen
        >
          <template #body="slotProps">
            <td style="text-align: right" v-if="rol == 1 || rol == 5">
              <Button
                v-if="slotProps.data.estado == 0"
                label="Turno Cerrado"
                icon="pi pi-ban"
                class="mr-2 mb-2 p-button-warning"
                v-on:click="updateState(slotProps.data.id, 'Abrir')"
              />
              <Button
                v-else
                label="Turno Abierto"
                icon="pi pi-check"
                class="mr-2 mb-2 p-button-info"
                v-on:click="updateState(slotProps.data.id, 'Cerrar')"
              />
            </td>
            <td style="text-align: right" v-else>
              <span
                :class="'customer-badge status-unqualified'"
                v-if="slotProps.data.estado == 0"
              >
                Turno Cerrado
              </span>
              <span :class="'customer-badge status-qualified'" v-else>
                Turno Abierto
              </span>
            </td>
          </template>
        </Column>
        <!-- <Column
          field="ventas_fiscales"
          header="Ventas Fiscales"
          :style="{ width: '100px' }"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-file-pdf"
              label="V.F."
              class="mr-2 mb-2 p-button-rounded p-button-outlined p-button-danger"
              v-on:click="get_tax_sales(slotProps.data.id)"
            />
          </template>
        </Column> -->
        <Column field="detalle" header="Reporte Ventas" :style="{ width: '100px' }">
          <template #body="slotProps">
            <Button
              icon="pi pi-file-pdf"
              class="mr-2 mb-2 p-button-danger"
              v-on:click="print_pdf(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <modal :show="showModal" :datas="detail" @close="showModal = false">
      <template #header> </template>
    </modal>
  </div>

  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <div class="grid">
        <div class="field col-10">Total</div>
        <div class="field col-2">
          {{ total_ventas }}
          Bs.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Modal from "../components/Carrito.vue";
import downloadPDF from "../utils/VFiscalesPDF.js";
import CierreTurnoPDF from "../utils/CierreTurnoPDF.js";
import { inject } from "vue";

//pi-eye

export default {
  name: "turns",
  data() {
    return {
      desde: "",
      hasta: "",
      ventas_turno: [],
      ventas: [],
      detail: "",
      showModal: false,
      sale_tax: null,
      rol: 0,
      total_ventas: 0,
    };
  },
  mounted() {
    this.authenticacion();
    this.getListTurn(
      new Date(Date.now()).getFullYear() +
        "-" +
        (new Date(Date.now()).getMonth() + 1) +
        "-" +
        new Date(Date.now()).getUTCDate(),
      new Date(Date.now()).getFullYear() +
        "-" +
        (new Date(Date.now()).getMonth() + 1) +
        "-" +
        new Date(Date.now()).getUTCDate(),
      JSON.parse(localStorage.getItem("User")).sucursal
    );
  },
  methods: {
    authenticacion() {
      if (localStorage.getItem("User") == null) {
        this.$router.push("/login");
      } else {
        this.rol = JSON.parse(localStorage.getItem("User")).rol;
      }
    },

    //API para obtener las ventas fiscales de un determinado turno de una determinada sucursal

    get_tax_sales(turno_id) {
      console.log('turno ' + turno_id);
        axios
        .get(
          this.url +
            "get_tax_sales?turno_id=" +
            turno_id +
            "&sucursal_id=" +
            JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((result) => {
          console.log(result.data);
          this.sale_tax = result.data.ventas_fiscales;
          let datos_extras = {
            usuario: JSON.parse(localStorage.getItem("User")).name,
            sucursal: JSON.parse(localStorage.getItem("User")).sucursal_nombre,
            fecha: result.data.fecha,
            hora_inicio: result.data.hora_inicio,
            hora_fin: result.data.hora_fin,
            turno: result.data.turno,
            primera_venta: result.data.primera_venta==null?0:result.data.primera_venta.numero_factura,
            ultima_venta: result.data.ultima_venta==null?0:result.data.ultima_venta.numero_factura,
          };
          downloadPDF(this.sale_tax, datos_extras);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /* APIs para el Cierre de Turno  */
    print_pdf(turno_id) {
      axios
        .get(
          this.url +
            "obtener_ventas_turno?turno_id=" +
            turno_id +
            "&sucursal_id=" +
            JSON.parse(localStorage.getItem("User")).sucursal
        )

        .then((result) => {
          if (result.status === 200) {
            console.log(result.data);
            let data = {
              ventas_x_plato: result.data.ventas_x_plato,
              ventas_x_categoria: result.data.ventas_x_categoria,
              ventas_anuladas: result.data.ventas_anuladas,
              comida_personal: result.data.comida_personal,
              tt:result.data.tt,
              tp:result.data.tp
            };

            let datos_extras = {
              usuario: JSON.parse(localStorage.getItem("User")).name,
              sucursal: JSON.parse(localStorage.getItem("User"))
                .sucursal_nombre,
              fecha: result.data.fecha,
              hora_inicio: result.data.hora_inicio,
              hora_fin: result.data.hora_fin,
              turno: result.data.turno,
            };
            axios
        .get(
          this.url +
            "get_tax_sales?turno_id=" +
            turno_id +
            "&sucursal_id=" +
            JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((result) => {
          console.log(result.data);
          this.sale_tax = result.data.ventas_fiscales;
          // downloadPDF(this.sale_tax, datos_extras);
          CierreTurnoPDF(data, datos_extras,this.sale_tax);
        })
        .catch((e) => {
          console.log(e);
        });

            // CierreTurnoPDF(data, datos_extras);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getListTurn(inicio, fin, sucursal) {
      axios
        .get(
          this.url +
            "list_turns?fecha_inicio='" +
            inicio +
            "'&fecha_fin='" +
            fin +
            "'&sucursal=" +
            sucursal
        )
        .then((result) => {
          console.log("turnos :", result.data.turns);
          this.ventas = result.data.turns;
          this.ventas.forEach((venta) => {
            console.log(venta);
            if (venta.ventas != null) {
              this.total_ventas += parseFloat(venta.ventas);
            }
          });
          console.log(this.total_ventas);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    filterDates() {
      let d = new Date(this.desde);
      let d1 = new Date(this.hasta);
      let data1 =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getUTCDate();
      let data2 =
        d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getUTCDate();
      this.getListTurn(
        data1,
        data2,
        JSON.parse(localStorage.getItem("User")).sucursal
      );
    },
    updateState(identificador, estado) {
      this.$swal
        .fire({
          title: "Desea " + estado + " el Turno ?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si cambiar",
        })
        .then((result) => {
          let data = {
            id: identificador,
            state: estado,
          };
          if (result.isConfirmed) {
            axios
              .post(this.url + "update_state_turn", data)
              .then((result) => {
                if (result.data.status) {
                  this.$swal.fire({
                    icon: "success",
                    title: "El estado se ha cambiado correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  this.getListTurn(
                    new Date(Date.now()).getFullYear() +
                      "-" +
                      (new Date(Date.now()).getMonth() + 1) +
                      "-" +
                      new Date(Date.now()).getUTCDate(),
                    new Date(Date.now()).getFullYear() +
                      "-" +
                      (new Date(Date.now()).getMonth() + 1) +
                      "-" +
                      new Date(Date.now()).getUTCDate(),
                    JSON.parse(localStorage.getItem("User")).sucursal
                  );
                } else {
                  this.$swal.fire({
                    icon: "warning",
                    title: "El estado no se ha cambiado correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        });
    },
  },
  components: {
    Modal,
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
