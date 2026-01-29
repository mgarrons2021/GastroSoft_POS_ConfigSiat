<template>
  <div>
    <button class="btn" @click="downloadPDF">Download PDF</button>
  </div>
</template>
<script>
import jsPDF from "jspdf";

export default {

  data() {
    return {};
  },

  mounted() { },
  methods: {
    downloadPDF() {
      var pdf = new jsPDF();

      pdf.setFont("Arial");

      pdf.setFontSize(10);
      pdf.text("DONESCO S.R.L", 28, 4, "center");
      pdf.text("BODEGA PRINCIPAL", 28, 8, "center");
      pdf.setFontSize(8);
      pdf.text("Celular: 71387934", 28, 12, "center");
      pdf.text("Calle Mario Flores y Padre Adrian Melgar", 28, 16, "center");
      pdf.text("Santa Cruz - Bolivia", 28, 20, "center");
      pdf.text("SCF 1", 28, 24, "center");
      pdf.setFont("Arial", "B");
      pdf.setFontSize(11);
      pdf.text("FACTURA ORIGINAL", 28, 28, "center");
      pdf.text(
        "---------------------------------------------------",
        25,
        34,
        "center"
      );

      pdf.setFontSize(10);
      pdf.text("NIT: " + "166172023", 2, 38);
      pdf.text("FACTURA: " + "127", 2, 42);
      pdf.text("AUTORIZACION: " + "38401000410190", 2, 46);
      pdf.setFontSize(11);
      pdf.text(
        "---------------------------------------------------",
        25,
        52,
        "center"
      );

      pdf.setFontSize(10);
      pdf.text("Actividad Economica: " + "Restaurante", 2, 56);
      pdf.text("Fecha: " + "15/07/2022", 2, 60);
      pdf.text("Hora: " + "14:38:16", 2, 64);
      pdf.text("Cliente: " + "MONEDAS", 2, 68);
      pdf.text("Nit/Ci: " + "123", 2, 72);

      pdf.setFontSize(11);
      pdf.text(
        "---------------------------------------------------",
        25,
        78,
        "center"
      );

      pdf.setFontSize(10);
      pdf.text("Cant", 2, 82);
      pdf.text("Concepto", 12, 82);
      pdf.text("P. Unit", 30, 82);
      pdf.text("Total", 50, 82);

      var string = pdf.output("datauristring");
      var embed = "<embed width='100%' height='100%' src='" + string + "'/>";
      var x = window.open();
      x.document.open();
      x.document.write(embed);
      x.document.close();
    },
  },
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>