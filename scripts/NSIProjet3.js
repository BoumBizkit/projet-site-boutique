// === variables constantes (s'expliquent d'elles même)(je ne trouve d'ailleurs pas beaucoup d'intérêt aux IdKey: pourquoi ne pas faire: index + "-product" au lieu de: index + "-" + productIdKey) ===
const MAX_QTY = 9;
const BUDGET_MAX = 400;
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
	// modif du h2
	document.getElementById("budget-titre").innerHTML = "Le budget pour la classe est de " + BUDGET_MAX + " euros.";
}
// appelle de l'init après le chargement de la page
window.addEventListener("load", init);

// FONCTIONS UTILES
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

// creation du shop appelée par l'init avec un parcours par indice qui appelle la création de chaque produit
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

// creation de produits avec plusieurs appels à des sous branches
var createProduct = function (product, index) {
	// creation du div
	var block = document.createElement("div");
	block.className = "produit";
	// définit l'id du produit
	block.id = index + "-" + productIdKey;
	// partie h4 de "block"
	block.appendChild(createBlock("h4", product.name));
	// ajoutes le figure (image)
	block.appendChild(createFigureBlock(product));
	// crée et ajoute la partie div.description de "block"
	block.appendChild(createBlock("div", product.description, "description"));
	// crée et ajoute la partie div.price de "block"
	block.appendChild(createBlock("div", product.price, "prix"));
	// crée et ajoute la div.control de "block" 
	block.appendChild(createOrderControlBlock(index));
	return block;
}


// fonction de création d'éléments html : elle crée un élément du type tag donné (ex: "div", "h4"), lui assigne éventuellement une classe CSS, et place le contenu dans son innerHTML (évite la répétition dans le code)
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

// crée le div.control d'un élément
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// crée le champ input de control
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();
	// définit l'écoute d'un changement de chiffre dans le champs input pour appeler gererChange
	input.addEventListener("change",gererChange);
	// ajoute input à control
	control.appendChild(input);
	
	// crée le bouton d'ajout au panier
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	// ajout du bouton à control
	control.appendChild(button);
	// définit l'écoute du click sur le bouton pour le faire fonctionner (appel de gererCommande)
	button.addEventListener("click", gererCommande);
	
	// renvoie le div.control
	return control;
}

// gestion de la quantité max et min qu'on peut taper dans le champs "(id du produit)-qte" et opacité si quantité différente de 0
var gererChange = function() {
	var identifiant = this.id;
	var qte= Number(this.value);
	if (qte>9||qte<0){
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

// gestion du clic (mise en panier) appelée par l'event click du bouton panier
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
		if (nouvelleQte > 9) {
			nouvelleQte = 9;
		}
        qteSpan.innerHTML = nouvelleQte;
            (nouvelleQte * product.price);
        total += product.price * qte;
    }
    // nouveau produit
    else {
        panier.appendChild(createAchatBlock(product, index, qte));
        total += product.price * qte;
    }
    // mise à jour affichage total et budget
    document.getElementById("montant").innerHTML=total;
	verifierBudget();
    // reset quantité
    input.value = 0;
    this.style.opacity = 0.25;
}

// crée les éléments dans le panier
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
	// écoute sur le bouton pour gerer la suppression
	suppr.addEventListener("click", gererSuppression);
    control.appendChild(suppr);
    achat.appendChild(control);
	// renvoyer la div achat
    return achat;
}

// fonction supprimer
var gererSuppression = function() {
    var index = this.id.split("-")[0];
    var achat = document.getElementById(index + "-achat");
    
    // soustraire du total
    var qte = Number(document.getElementById(index + "-achat-qte").innerHTML);
    var product = catalog[index];
    total -= product.price * qte;

	// mise à jour affichage total et budget
    document.getElementById("montant").innerHTML = total;
	verifierBudget();
    
    // supprimer le bloc du panier
    achat.remove();
}

// vérifie le budget
var verifierBudget = function() {
    var titre = document.getElementById("budget-titre");
    if (total > BUDGET_MAX) {
        titre.innerHTML = "⚠️ Le budget de " + BUDGET_MAX + " euros est dépassé !";
        titre.style.backgroundColor = "red";
        titre.style.color = "white";
    } else {
        titre.innerHTML = "Le budget pour la classe est de " + BUDGET_MAX + " euros.";
        titre.style.backgroundColor = "";
        titre.style.color = "";
    }
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
