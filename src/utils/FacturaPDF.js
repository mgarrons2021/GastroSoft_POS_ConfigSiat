import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";
import moment from "moment";

let datos_empresa = {
  nombre: "GASTROSOFT",
  celular: "78555410",
  nit: "5371072016",
};
let fecha_actual = new Date();
let hora_actual_2 = new Date();
hora_actual_2 = hora_actual_2.getHours() + ":" + hora_actual_2.getMinutes();

export default function downloadPDF(
  datos,
  autorizacion,
  visita,
  cuf = null,
  idcliente = null,
  leyenda = null,
  punto_venta = 0
) {
  var hora_actual;
  if (datos.hora_actual) {
    let hora = moment(datos.hora_actual, "HH:mm:ss").format("HH:mm");
    hora_actual = hora;
  } else {
    hora_actual = moment().format("HH:mm");
  }
  var fecha_actual2 =
    fecha_actual.getDate() +
    "/" +
    (fecha_actual.getMonth() + 1) +
    "/" +
    fecha_actual.getFullYear();

  if (datos.fecha_emision_manual != null && datos.hora_emision_manual != null) {
    hora_actual = moment(datos.hora_emision_manual, "HH:mm:ss").format("HH:mm");
    fecha_actual2 = moment(datos.fecha_emision_manual, "Y-MM-DD").format(
      "DD/MM/Y"
    );
  }

  var content_qr = document.getElementById("content_qr");
  content_qr.style.opacity = 1;
  html2canvas(content_qr).then(function (canvas) {
    let tamanio = datos.detalle_venta.length;
    let largoFactura = 210;
    for (let index = 0; index < tamanio; index++) {
      largoFactura += 13;
    }
    let pdf = new jsPDF("p", "mm", [largoFactura, 90]);

    var width = pdf.internal.pageSize.getWidth();
    let salto = 0;
    let codigo_fiscal = JSON.parse(localStorage.getItem("User")).codigo_fiscal;
    let direccion = JSON.parse(localStorage.getItem("User")).direccion;

    pdf.setFontSize(9);
   
    salto += 3;
    pdf.setFont(undefined, 'bold').text("FACTURA", width / 2, salto, { align: "center" }).setFont(undefined, 'normal');
    salto += 3;
    pdf.setFont(undefined, 'bold').text("CON DERECHO A CRÉDITO FISCAL", width / 2, salto, {align: "center",}).setFont(undefined, 'normal') ;
    salto += 3;
    pdf.text(datos_empresa.nombre, width / 2, salto, "center");
    salto += 3;

    pdf.text("" + datos.sucursal_nombre, width / 2, salto, "center");
    salto += 3;

    pdf.text("No. Punto de Venta: " + punto_venta, width / 2, salto, "center");

    salto += 3;
    pdf.text("" + direccion, width / 2, salto, "center");
    salto += 3;
    pdf.text("Tel: " + datos_empresa.celular, width / 2, salto, "center");
    salto += 3;
    pdf.text("Santa Cruz de la Sierra", width / 2, salto, "center");
    salto += 3;
    pdf.text(
      "------------------------------------------------------------------------------------------------",
      width / 2,
      salto,
      "center"
    );
    pdf.setFontSize(9);
    salto += 4;
    pdf.setFont(undefined, 'bold').text("NIT", width / 2, salto, "center").setFont(undefined, 'normal');
    salto += 4;
    pdf.text("" + datos_empresa.nit, width / 2, salto, "center");
    salto += 4;
    pdf.setFont(undefined, 'bold').text("FACTURA Nº", width / 2, salto, "center").setFont(undefined, 'normal');
    salto += 4;
    pdf.text("" + datos.nro_factura, width / 2, salto, "center");
    salto += 4;
    pdf.setFont(undefined, 'bold').text("CÓD. AUTORIZACIÓN", width / 2, salto, "center").setFont(undefined, 'normal');
    salto += 4;
    let cuf_part1 = cuf.substring(0, width / 2);
    let cuf_part2 = cuf.substring(width / 2, 85);
    pdf.text(cuf_part1, pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    salto += 3;
    pdf.text(cuf_part2, pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    salto += 4;
    pdf.setFontSize(9);
    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      width / 2,
      salto,
      "center"
    );

    let nombre = datos.cliente.toUpperCase().split(" ");
    let aux = 0;
    salto += 4;
    let nomb1 = "";
    let nomb2 = "";
    let nomb3 = "";
    let meses = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];

    if (nombre.length > 1) {
      for (let index = 0; index < nombre.length; index++) {
        aux += nombre[index].length;
        if (aux < 18) {
          nomb1 += nombre[index] + " ";
        } else if (aux < 36) {
          nomb2 += nombre[index] + " ";
        } else {
          nomb3 += nombre[index] + " ";
        }
      }
      nomb1;
      pdf.setFont(undefined, 'bold').text("NOMBRE/RAZÓN SOCIAL:", width * 0.03, salto).setFont(undefined, 'normal');
      pdf.text(nomb1, width * 0.5, salto);
      salto += 3;
      pdf.text(nomb2, width * 0.5, salto);
      if (aux > 36) {
        salto += 3;
        pdf.text(nomb3, width * 0.2, salto);
      }
    } else {
      pdf.setFont(undefined, 'bold').text("NOMBRE/RAZÓN SOCIAL:", width * 0.03, salto).setFont(undefined, 'normal');
      pdf.text(datos.cliente, width * 0.5, salto);
    }
    salto += 4;
    let complemento =
      datos.complemento != null && datos.complemento != ""
        ? " - " + datos.complemento
        : "";
    pdf.setFont(undefined, 'bold').text("                          NIT/CI/CEX:", width * 0.03, salto).setFont(undefined, 'normal');
    pdf.text(datos.nit_ci + complemento, width * 0.5, salto);
    salto += 4;
    pdf.setFont(undefined, 'bold').text("                   COD. CLIENTE:", width * 0.03, salto).setFont(undefined, 'normal');
    pdf.text(idcliente.toString(), width * 0.5, salto);
    salto += 4;
    pdf.setFont(undefined, 'bold').text("          FECHA DE EMISIÓN:", width * 0.03, salto).setFont(undefined, 'normal');
    if (datos.fecha != null) {
      pdf.text(datos.fecha + " " + hora_actual, width * 0.5, salto);
    } else {
      pdf.text(fecha_actual2 + " " + hora_actual, width * 0.5, salto);
    }
    salto += 4;

    pdf.text(
      "----------------------------------------------------------------------------------------------------------",
      width / 2,
      salto,
      "center"
    );

    //x,y
    salto += 4;
    pdf.setFont(undefined, 'bold').text("DETALLE", width / 2, salto, "center").setFont(undefined, 'normal');
    salto += 4;
    let subtotal_descuento = 0;
    datos.detalle_venta.forEach((element) => {
      if (element.plato.toString().length > 50) {
        pdf.setFont(undefined, 'bold').text(element.plato_id + " - " + element.plato.toString().substring(0, 50), width * 0.05,salto).setFont(undefined, 'normal');
      } else {
        pdf.setFont(undefined, 'bold').text(element.plato_id + " - " + element.plato.toString(), 2, salto).setFont(undefined, 'normal');
      }
      salto += 4;
      if (element.plato.toString().length > 50) {
        pdf.setFont(undefined, 'bold').text(element.plato.toString().substring(50, element.plato.toString().length),width * 0.05,salto).setFont(undefined, 'normal');
        salto += 4;
      }
      pdf.text("Unidad de Medida: Unidad (Servicios)", width * 0.05, salto);
      salto += 4;
      let _cantidad = parseFloat(element.cantidad);
      let descuento_conv = (element.descuento * (_cantidad * element.costo)/100);
      subtotal_descuento+= descuento_conv
      pdf.text(
        _cantidad.toFixed(2).toString() +
          " X " +
          element.costo.toString() +
          " - " +
          parseFloat(descuento_conv).toFixed(2).toString(),
        width * 0.05,
        salto
      );

      //pdf.text(element.costo.toString(), 50, salto);
      pdf.text(
        parseFloat(_cantidad * element.costo - descuento_conv).toFixed(2).toString(),
        width * 0.85,
        salto
      );
      salto += 5;
    });

    pdf.text(
      "--------------------------------------------------------------------------------------------------------",
      width / 2,
      salto,
      "center"
    );

    salto += 4;
    pdf.text(
      "                                         Subtotal Bs.",
      width * 0.1,
      salto
    );
    let subtotales= (datos.total_venta - datos.total_descuento).toFixed(2).toString()
    pdf.text(
      subtotales, width * 0.85, salto
    );
    salto += 4;
    pdf.text(
      "                                     Descuento Bs.",
      width * 0.1,
      salto
    );
    let descuento_adicional = parseFloat(datos.total_descuento_adicional).toFixed(2);
    pdf.text(descuento_adicional.toString(), width * 0.85, salto);
    salto += 4;
    pdf.text(
      "                                              Total Bs.",
      width * 0.1,
      salto
    );
    let total = parseFloat(subtotales - descuento_adicional).toFixed(2);
    pdf.text(total.toString(), width * 0.85, salto);
    salto += 4;
    pdf.text(
      "                             Monto Gift Card Bs.",
      width * 0.1,
      salto
    );
    let descuento_giftcard = parseFloat(datos.total_descuento_giftcard).toFixed(2);
    pdf.text(descuento_giftcard.toString(), width * 0.85, salto);
    salto += 4;
    pdf.setFont(undefined, 'bold').text(
      "                             Monto a Pagar Bs.",
      width * 0.1,
      salto
    );
    let monto_a_pagar = parseFloat( 0 +datos.total_venta - datos.total_descuento - descuento_adicional - descuento_giftcard 
    ).toFixed(2);
    pdf.text(monto_a_pagar.toString(), width * 0.85, salto);
    salto += 4;
    pdf.setFont(undefined, 'bold').text("       Importe Base Credito Fiscal Bs.", width * 0.1, salto);
    let importe_base_credito_fiscal = parseFloat(0 + datos.total_venta- descuento_giftcard - descuento_adicional - datos.total_descuento
    ).toFixed(2);
    pdf.text(importe_base_credito_fiscal.toString(), width * 0.85, salto).setFont(undefined, 'normal');
    salto += 6;
    pdf.setFontSize(9);
    pdf.text(
      "Son : " +
        NumeroaLetras(datos.total_venta - datos.total_descuento - descuento_adicional- descuento_giftcard, {
          plural: " Bolivianos",
          singular: " Boliviano",
          centPlural: " Centavos",
          centSingular: " Centavo",
        }).toLowerCase(),
      2,
      salto
    );

    salto += 4;
    //pdf.setFontSize(9);

    pdf.text(
      "----------------------------------------------------------------------------------------------------------",
      width / 2,
      salto,
      "center"
    );
    pdf.setFontSize(8);
    salto += 5;
    pdf.text('ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS,', pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    salto += 4;
    pdf.text(
      "EL USO ILÍCITO SERÁ SANCIONADO PENALMENTE DE",
      pdf.internal.pageSize.getWidth() / 2, salto, 'center'
    );
    salto += 4;
    pdf.text('ACUERDO A LEY', pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    salto += 6;
    pdf.setFontSize(8);
    pdf.text(leyenda.toString().substring(0, 58), pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    salto += 4;
    if (leyenda.toString().length > 120) {
      pdf.text(leyenda.toString().substring(58, 120), pdf.internal.pageSize.getWidth() / 2, salto, 'center');
      salto += 4;
      pdf.text(
        leyenda.toString().substring(120, leyenda.toString().length),
        pdf.internal.pageSize.getWidth() / 2, salto, 'center'
      );
      salto += 6;
    } else {
      pdf.text(
        leyenda.toString().substring(58, leyenda.toString().length),
        pdf.internal.pageSize.getWidth() / 2, salto, 'center'
      );
      salto += 6;
    }
    pdf.setFontSize(9);
    if (datos.evento_significativo_id === null) {
      pdf.text(
        '"Este documento es la Representación Gráfica de un',
        pdf.internal.pageSize.getWidth() / 2,
        salto, 'center'
      );
      salto += 4;
      pdf.text(
        "Documento Fiscal Digital emitido en una modalidad de",
        pdf.internal.pageSize.getWidth() / 2,
        salto, 'center'
      );
      salto += 4;
      pdf.text("facturación en línea”",pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    } else {
      pdf.text(
        '"Este documento es la Representación Gráfica de un',
        pdf.internal.pageSize.getWidth() / 2, salto, 'center'
      );
      salto += 4;
      pdf.text(
        "Documento Fiscal Digital emitido fuera de linea, verifique su",
        pdf.internal.pageSize.getWidth() / 2, salto, 'center'
      );
      salto += 4;
      pdf.text("envio con su proveedor o en la pagina web", pdf.internal.pageSize.getWidth() / 2, salto, 'center');
      salto += 4;
      pdf.text("www.impuestos.gob.bo”", pdf.internal.pageSize.getWidth() / 2, salto, 'center');
    }
    salto += 6;
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var imgWidth = 200;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", width * 0.3, salto, imgWidth, imgHeight, 'center'); //ideal 40
    content_qr.style.opacity = 0;
    salto += 35;

    if (datos.sucursal == 18) {
      pdf.text("Numero de Visita", 2, salto);
      pdf.text(visita.toString(), 55, salto);
    }

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

function parseFecha(fecha) {
  let fecha_actual = fecha;
  if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
    fecha_actual =
      fecha.getDate() +
      "/" +
      "0" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      "0" +
      fecha.getFullYear().toString();
  } else if (fecha.getDate() < 10) {
    fecha_actual =
      fecha.getDate() +
      "/" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      "0" +
      fecha.getFullYear().toString();
  } else if (fecha.getMonth() + 1 < 10) {
    fecha_actual =
      fecha.getDate() +
      "/0" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      fecha.getFullYear().toString();
  }
  //patricio Y ALEX FOREVER AND EVER
  return fecha_actual;
}

function parseFecha2(fecha) {
  let fecha_actual = fecha;
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
}
