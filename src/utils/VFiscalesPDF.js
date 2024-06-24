import jsPDF from "jspdf";

let datos_empresa = {
  nombre: "GASTROSOFT",
  celular: "78555410",
  fecha: "2021-03-23",
  nit: "5371072016",
};

let fecha_actual = new Date().toLocaleDateString();
let hora_actual = new Date().toLocaleTimeString();

export default function downloadPDF(datos,datos_extra) {
//--
    console.log(datos);
    console.log(datos_extra);

    let pdf = new jsPDF();

    pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000);

    pdf.setFontSize(11);
    pdf.text("REPORTE DE CIERRE", 2, 6);
    pdf.text("T.T.: " + "18", 2, 11);
    pdf.text("Fecha: "+datos_extra.fecha, 2, 16);
    pdf.text("Hr. Inicio: "+datos_extra.hora_inicio+" Hr. Cierre: "+ datos_extra.hora_fin, 2, 22);
    pdf.text("Usuario: "+datos_extra.usuario, 2, 28);
    pdf.text("Sucursal: "+datos_extra.sucursal, 2, 32);
    pdf.text("Turno: "+datos_extra.turno+"     Por Categoria", 2, 38);

    pdf.setFontSize(12);
    pdf.text("Cant", 2, 45);
    pdf.text("Descripcion", 18, 45);
    pdf.text("Total", 60, 45);
    let salto = 50;
    let total_fiscal = 0;
    datos.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      let _subtotal = parseFloat(element.subtotal).toFixed(2);
      total_fiscal+=element.subtotal;
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.nombre.toString(), 18, salto);
      pdf.text(_subtotal.toString(), 60, salto);
      salto += 4;
    });

    salto+=5;
    pdf.text("Total Fiscal :        "+ parseFloat(total_fiscal).toFixed(2), 2, salto);
    salto+=6;
    pdf.text("Primera factura :        "+datos_extra.primera_venta,  2, salto);
    salto+=5;
    pdf.text("Ultima factura :        "+datos_extra.ultima_venta  , 2, salto);



    var string = pdf.output("datauristring");
    var embed =
      "<embed width='100%' height='100%' src='" + string + "'><embed/>";
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
  
}

