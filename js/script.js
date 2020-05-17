/**
 * @fileoverview Caja registradora, con valores de denominacion alamcenados para intercambio
 * @author Anderson Danilo Guerrero Calpa <adguerreroc@unal.edu.co>
 * @copyright Academia Geek
 * @param {number, number,array}
 * @return {object}
 * 
 * 
 * 
 * Acontinuacion las nominaciones de cada billete almacendao en un arreglo de objetos
 */
var difNom = [
    { name: "ONE HUNDRED", val: 100.0 },
    { name: "TWENTY", val: 20.0 },
    { name: "TEN", val: 10.0 },
    { name: "FIVE", val: 5.0 },
    { name: "ONE", val: 1.0 },
    { name: "QUARTER", val: 0.25 },
    { name: "DIME", val: 0.1 },
    { name: "NICKEL", val: 0.05 },
    { name: "PENNY", val: 0.01 }
  ];
  
  let cashReg=(price, cash, cid)=>{
    var out = {status:null, change:[]};
    var change = cash-price;
    
    //transformacion del arreglo en un objeto
    var reg =cid.reduce((acum, ind)=>{
        acum.tot+=ind[1];
        acum[ind[0]]= ind[1];
        return acum;
    },
    { tot:0});
    //Encargado del cambio exacto (change)
    if(reg.tot === change){
        out.status="CLOSED";
        out.change=cid; 
        return out;
    }
    //encargado de verificar la insuficiencia de efectivo
    if(reg.tot < change){
        out.status="INSUFFICIENT_FUNDS";
        return out;
    }

    var arrChange=difNom.reduce((acum,ind)=>{
        var vlr=0;
        //mientras haya dinero de esta denominacion en la caja y mientras 
        //el cambio se mayor a los valores de la denominacion.
        while(reg[ind.name]>0 && change>=ind.val){
            change-=ind.val;
            reg[ind.name]-=ind.val;
            vlr+=ind.val;

            //funcion para acercar al valor, mas proximo o redondeo
            change=Math.round(change*100)/100;
        }
        //agregamos la denominacion solo que fue usada o encontrada
        if(vlr>0){
            acum.push([ind.name, vlr]);
        }
        return acum;
    },[]);

    //si no hay elementos que coincidieran en el cambio o si hay cambios restantes
    if(arrChange.length<1 || change>0){
        out.status="INSUFFICIENT_FUNDS";
        return out;
    }
    //El cambio o vueltas
    out.status="OPEN";
    out.change=arrChange;
    return out;
}
  
  
//evento que se llamada atraves de la interfaz
  document.querySelector('#btn_enviar').addEventListener('click',(e)=>{
      e.preventDefault();
    let precio=parseFloat(document.querySelector('#precio').value);
    let cambio=parseFloat(document.querySelector('#efectivo').value);
    //utilizamos JSON.parse() para convertir un dato serializado como string a un arreglo u objeto.
    let nomDine=JSON.parse(document.querySelector('#cant_nom').value);
    let salida=cashReg(precio,cambio,nomDine);
    console.log(salida);
    document.querySelector('#result').innerHTML=`El resultado es: ${salida.status} y ${salida.change}`

})