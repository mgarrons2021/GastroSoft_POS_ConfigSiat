<script>
export default {
  props: {
    show: Boolean,
    datas:Array,
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">DETALLE DE VENTA</slot>
          </div>

          <div class="modal-body">
            <DataTable
              :value="datas"
              :scrollable="false"
              scrollHeight="500px"
              scrollDirection="top"
              responsiveLayout="scroll"
            >
                <Column
                field="nombre"
                header="Nombre"
                :style="{ width: '150px' }"
                frozen
              ></Column>
              <Column
                field="cantidad"
                header="Cantidad"
                :style="{ width: '150px' }"
                frozen
              ></Column>
                <Column
                field="precio"
                header="Precio"
                :style="{ width: '150px' }"
                frozen
              ></Column>
              <Column
                field="descuento"
                header="Descuento"
                :style="{ width: '150px' }"
                frozen
              ></Column>
                <Column
                field="subtotal_neto"
                header="Subtotal"
                :style="{ width: '150px' }"
                frozen
              ></Column>
            </DataTable>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              
             
              <Button
                label="OK"                
                style="padding: 10px; margin-top: 5px"
                @click="$emit('close')"
              />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
