function prepareData(element){
    var id = element.id;
    var quant = element.value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200) {
            var parsedStuff = JSON.parse(this.responseText);
            var magicalID = parsedStuff.img;
            console.log(magicalID);
            document.getElementById(magicalID).innerHTML = "$"+ parsedStuff.quantity * parsedStuff.price + ".00";
        };
    }
    xhttp.open("GET", "/updateCart/" + id + "/"+ quant, true);
    xhttp.send();
//    console.log(element.id);
}