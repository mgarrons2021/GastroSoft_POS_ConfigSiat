import ConectorPlugin from "../utils/ConectorPrint.js";

export default function prints() {
  console.log("hola");
  const conector = new ConectorPlugin();
  var impres='';
  ConectorPlugin
    .obtenerImpresoras()
    .then(impresoras => {
      console.log(impresoras);
      impres = impresoras;
      console.log(conector);
      
      conector.texto("Me gusta imprimir\n");
      console.log(conector);
      conector.feed(1);
      conector.cortar();
      conector.cortarParcialmente();
      

      conector.imprimirEn( impresoras[2] )      
      .then(respuestaAlImprimir => {
          if (respuestaAlImprimir === true) {
              console.log("Impreso correctamente");
              
          } else {
              console.log("Error. La respuesta es: " + respuestaAlImprimir);
          }
      });
      
      console.log(conector);
      
      /* ConectorPlugin
      .texto("Hola mundo\n")
      .imprimirEn( impresoras[5])
      .then(respuestaAlImprimir => {
          if (respuestaAlImprimir === true) {
              console.log("Impreso correctamente");
          } else {
              console.log("Error. La respuesta es: " + respuestaAlImprimir);
          }
      }); */

    })
    .catch((err) => {
      console.log(err);
    }); 

    /* console.log(impres); 
    console.log(conector);
    conector.texto("Me gusta imprimir\n");
    console.log(conector);
    conector.imprimirEn("\\\\192.168.116.109\\BIXOLON SRP-330II")
    .then(respuestaAlImprimir => {
        if (respuestaAlImprimir === true) {
            console.log("Impreso correctamente");
        } else {
            console.log("Error. La respuesta es: " + respuestaAlImprimir);
        }
    });
    console.log(conector);
 */
    //conector.imprimirEn( '\\\\192.168.116.109\\BIXOLON SRP-330II');

    /* ConectorPlugin.texto("Hola mundo\n");
    ConectorPlugin.imprimirEn("\\\\192.168.116.109\\BIXOLON SRP-330II")
    .then(respuestaAlImprimir => {
        if (respuestaAlImprimir === true) {
            console.log("Impreso correctamente");
        } else {
            console.log("Error. La respuesta es: " + respuestaAlImprimir);
        }
    }); */

    // \\192.168.116.109\BIXOLON SRP-330II

    

}
