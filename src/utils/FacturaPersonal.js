import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";

let fecha_actual = new Date().toLocaleDateString();
let hora_actual = new Date().toLocaleTimeString();

export default function downloadPDFP(datos, visita) {

    var content_qr = document.getElementById("content_qr");

    html2canvas(content_qr).then(function (canvas) {
      var pdf = new jsPDF();
  
      pdf.addFont('Roboto-Medium.ttf', 'helvetica', 'bold', 1000);

      let fecha='';
      if(datos.fecha==null){
        fecha = fecha_actual+' '+hora_actual;
      }else{
        fecha=datos.fecha;
      }

      pdf.setFontSize(10);                
      pdf.text('Comida para personal', 40, 4, "center");
      pdf.text("Orden : "+datos.orden   , 2, 10);
      pdf.text("Sucursal : "+datos.sucursal_nombre , 2, 16);
      pdf.text("Recoge : "+datos.cliente , 2, 22);   
      pdf.text("Fecha : "+fecha, 2, 28);

      pdf.addFont('Roboto-Medium.ttf', 'helvetica', 'bold', 1000);                                 

      pdf.text("Cant", 2, 34);
      pdf.text("Concepto", 15, 34);
      pdf.text("P. Unit", 40, 34);
      pdf.text("Total", 55, 34);
      let salto = 40;
      datos.detalle_venta.forEach((element) => {
        let _cantidad = parseFloat(element.cantidad).toFixed(2);
        pdf.text(_cantidad.toString(), 2, salto);
        pdf.text(element.plato.toString(), 15, salto);
        pdf.text(element.costo.toString(), 40, salto);
        pdf.text(element.subtotal.toString(), 55, salto);
        salto += 4;
      });                                                            
                                                  
      salto += 4;
  
      pdf.text("Total Bs", 2, salto);
      let total = parseFloat(datos.total_venta).toFixed(2);
      pdf.text(total.toString(), 55, salto);
      salto += 15;

      pdf.text(
        "------------------------------------------------------------------------------------------------------------------",
        5,
        salto,
        "center"
      );
      salto+=4;
      pdf.text('Firma', 40, salto, "center");
  
      /*  doc.save("comprobanteVenta.pdf"); */
      var string = pdf.output("datauristring");


      var embed =
        "<embed width='100%' height='100%' src='" + string + "'><embed/>";
      var x = window.open();
      x.document.open();
      x.document.write(embed);
      x.document.close();
    });
  }
  
  function generarCodigoControl(codigo_control) {
    return generateControlCode(
      codigo_control.nro_autorizacion,
      codigo_control.nro_factura,
      codigo_control.nit_ci,
      codigo_control.fecha_transaccion,
      codigo_control.total_transaccion,
      codigo_control.llave_dosificacion
    );
  }
  
  function redondear(monto) {
    let _monto = monto.toFixed(1);
    let dato = _monto.toString();
    let ultimo = _monto.toString().charAt(dato.length - 1);
    console.log("dato: ", dato);
    console.log("ultimo: ", ultimo);
    if (parseInt(ultimo) > 5) {
      _monto = Math.round(_monto);
      console.log(_monto);
    } else {
      if (parseInt(ultimo) == 0) {
        _monto = Math.round(_monto);
        console.log(_monto);
      } else {
        _monto = Math.round(_monto) + ".50";
        console.log(_monto);
      }
    }
    return _monto;
}

  
