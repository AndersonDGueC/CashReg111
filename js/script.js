var denom = [
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
    var out = {status:null, change:[]}
    var change = cash-price;
    
    //transformacion del arreglo en un objeto
    var reg =cid.reduce((acum, ind)=>{
        acum.tot+=ind[1];
        acum[ind[0]]= ind[1];
        return acum;
    },
    { total:0});
    //Encargado del cambio exacto (change)
    if(reg.total === change){
        out.status="CLOSED";
        out.change=cid;
        return out;
    }
    //encargado de verificar la insuficiencia de efectivo
    if(reg.total < change){
        out.status="INSUFFICIENT_FUNDS";
        return out;
    }

    var arrChange=denom.reduce((acum,ind)=>{
        var vlr=0;
        //mientras haya dinero de esta denominacion en la caja y mientras 
        //la denomicion es mayor que el cambio restante
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

  }

  document.querySelector('#btn_enviar').addEventListener('click',(e)=>{
      e.preventDefault();
    let precio=parseFloat(document.querySelector('#precio').value);
    let cambio=parseFloat(document.querySelector('#efectivo').value);
    let nomDine=document.querySelector('#cant_nom').value.split("");
    console.log(nomDine);
    let salida=cashReg(precio,cambio,nomDine);
    document.querySelector('#result').innerHTML=`El resultado es: ${salida}`
  })