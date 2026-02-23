// YNN ET MAYA L'ABEILLE TROUVEZ UN NOM FLEMME LA

// === variables constantes (s'expliquent d'elles même) ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === variables globales  ===
// cout total du panier
var total = 0;



// initialisation du js
var init = function () {
	// définit filtre et met une écoute keyup sur "filter" qui appelle filtrer
	var filtre=document.getElementById("filter");
	filtre.addEventListener("keyup",filtrer);
	// appelle la creation du shop
	createShop();
	
}
// appelle de l'init après le chargement de la page
window.addEventListener("load", init);

// fonction filtrer du champs "filter" appelée par keyup
var filtrer = function() {
	var filtre=this.value;
	for(var i = 0; i < catalog.length; i++) {
		var productName=catalog[i].name;
		var index=i.toString()+"-product";
		var name=document.getElementById(index);
		if (productName.indexOf(filtre)==(-1)) {
			name.style.display="none";
		}
		else {
			name.style.display="inline-block";
		}
	}
}

// gestion de la quantité max qu'on peut taper dans le champs "(id du produit)-qte" et opacité si quantité différente de 0
var gererChange = function() {
	var identifiant = this.id;
	var qte= Number(this.value);
	if (qte>9){
		qte=0;
		this.value=0;
	}	
	var index = identifiant.split("-")[0];

	var bouton = document.getElementById(index + "-" + orderIdKey);
	if (qte==0) {
		bouton.style.opacity=0.25;
	}
	else {
		bouton.style.opacity=1;
	}
}

// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();

	input.addEventListener("change",gererChange);
	// add input to control as its child
	control.appendChild(input);
	
	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	// add button to control as its child
	control.appendChild(button);
	// fonctionnement du bouton
	button.addEventListener("click", gererCommande);
	
	// the built control div node is returned
	return control;
}

var createAchatBlock = function(product, index, qte) {
    var achat = document.createElement("div");
    achat.className = "achat";
    achat.id = index + "-achat";

    // image
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    figure.appendChild(img);
    achat.appendChild(figure);

    // nom
    achat.appendChild(createBlock("h4", product.name));

    // quantité
    var qty = createBlock("div", qte, "quantite");
    qty.id = index + "-achat-qte";
    achat.appendChild(qty);

    // prix unitaire
    var prix = createBlock("div", product.price, "prix");
    prix.id = index + "-achat-prix";
    achat.appendChild(prix);

    // bouton retirer
    var control = document.createElement("div");
    control.className = "controle";
    var suppr = document.createElement("button");
    suppr.className = "retirer";
    suppr.id = index + "-remove";
	suppr.addEventListener("click", gererSuppression);
    control.appendChild(suppr);
    achat.appendChild(control);

    return achat;
}

// gestion du clic (mise en panier)
var gererCommande = function() {
    var index = this.id.split("-")[0];
    var input = document.getElementById(index + "-" + inputIdKey);
    var qte = Number(input.value);
	if (qte === 0) return;
   	var product = catalog[index];
   	var panier = document.getElementById("achats");
   	var achatExistant = document.getElementById(index + "-achat");

    // produit déjà dans le panier
    if (achatExistant != null) {
        var qteSpan = document.getElementById(index + "-achat-qte");
        var prixSpan = document.getElementById(index + "-achat-prix");
        var ancienneQte = Number(qteSpan.innerHTML);
        var nouvelleQte = ancienneQte + qte;
        qteSpan.innerHTML = nouvelleQte;
            (nouvelleQte * product.price);
        total += product.price * qte;
    }
    // nouveau produit
    else {
        panier.appendChild(createAchatBlock(product, index, qte));
        total += product.price * qte;
    }
    // mise à jour affichage total
    document.getElementById("montant").innerHTML =
        total;
    // reset quantité
    input.value = 0;
    this.style.opacity = 0.25;
}

var gererSuppression = function() {
    var index = this.id.split("-")[0];
    var achat = document.getElementById(index + "-achat");
    
    // soustraire du total
    var qte = Number(document.getElementById(index + "-achat-qte").innerHTML);
    var product = catalog[index];
    total -= product.price * qte;
    document.getElementById("montant").innerHTML = total;
    
    // supprimer le bloc du panier
    achat.remove();
}

// créer le FigureBlock
var createFigureBlock = function (product) {
	var control=document.createElement("figure");
	control.className="controle";
	var image=document.createElement("img");
	image.src=product.image;
	image.alt=product.name;
	control.appendChild(image);
	
	return control;
}
