var sugar_data = [
  {
    "title": "Corn Sugar",
    "search_term": "corn+sugar",
    "factor": 4,
    "weightfactor": 1,
    "volumedivide": 200,
    "volumefactor": 1
  },
  {
    "title": "Sucrose",
    "search_term": "sucrose",
    "factor": 4,
    "weightfactor": 0.91,
    "volumedivide": 200,
    "volumefactor": 0.88
  },
  {
    "title": "Turbinado",
    "search_term": "turbinado",
    "factor": 4,
    "weightfactor": 0.91,
    "volumedivide": 200,
    "volumefactor": 0.88
  },
  {
    "title": "Demarara",
    "search_term": "demarara",
    "factor": 4,
    "weightfactor": 0.91,
    "volumedivide": 200,
    "volumefactor": 1
  },
  {
    "title": "Dextrose",
    "search_term": "dextrose",
    "factor": 4,
    "weightfactor": 1,
    "volumedivide": 200,
    "volumefactor": 1
  },
  {
    "title": "Corn Syrup",
    "search_term": "corn+syrup",
    "factor": 5.3,
    "weightfactor": 1,
    "volumedivide": 325,
    "volumefactor": 1
  },
  {
    "title": "Brown Sugar",
    "search_term": "Brown+Sugar",
    "factor": 4.1,
    "weightfactor": 1,
    "volumedivide": 230,
    "volumefactor": 1
  },
  {
    "title": "Molasses",
    "search_term": "Molasses",
    "factor": 5.1,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Maple Syrup",
    "search_term": "Maple+Syrup",
    "factor": 4.7,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Sorghum Syrup",
    "search_term": "Sorghum+Syrup",
    "factor": 5.3,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Honey",
    "search_term": "Honey",
    "factor": 4.9,
    "weightfactor": 1,
    "volumedivide": 340,
    "volumefactor": 1
  },
  {
    "title": "DME - All Varieties",
    "search_term": "DME",
    "factor": 5.33,
    "weightfactor": 1,
    "volumedivide": 165,
    "volumefactor": 1
  },
  {
    "title": "DME - Laaglander",
    "search_term": "DME",
    "factor": 7.3,
    "weightfactor": 1,
    "volumedivide": 165,
    "volumefactor": 1
  },
  {
    "title": "Belgian Candy Syrup - All",
    "search_term": "Belgian+Candy+Syrup",
    "factor": 5.75,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Belgian Candy Sugar - All",
    "search_term": "Belgian+Candy+Sugar",
    "factor": 4.85,
    "weightfactor": 1,
    "volumedivide": 230,
    "volumefactor": 1
  },
  {
    "title": "Invert Sugar Syrup - All",
    "search_term": "Invert+Sugar",
    "factor": 4,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Black Treacle",
    "search_term": "Black+Treacle",
    "factor": 4.2,
    "weightfactor": 1,
    "volumedivide": 320,
    "volumefactor": 1
  },
  {
    "title": "Rice Solids",
    "search_term": "Rice+Solids",
    "factor": 4.6,
    "weightfactor": 1,
    "volumedivide": 220,
    "volumefactor": 1
  }
];

var searchUrl = '/shop/search/?q=' 

function reload() {
  location.reload(true);
}
function primeCalc() {
  var co2Volume = document.getElementById("co2Volume").value;
  var SIGDIGITS = 2;
  var tempF = document.getElementById("tempF");
  var dissolvedCO2 = ((-0.9753) * Math.log(tempF.value) + 4.9648);
  var volBeer = document.getElementById("beerVol");
  if (document.getElementById("desiredCO2").value == "") {
    return;
  }
  if (document.getElementById("co2Volume").value == "") {
    return;
  }
  if (document.getElementById("tempF").value == "") {
    return;
  }
  if (document.getElementById("beerVol").value == "") {
    return;
  }
  if (co2Volume.value == null || document.getElementById("desiredCO2").value !== 0  ) {
    co2Volume = document.getElementById("desiredCO2");
    var primeAmount = co2Volume.value * volBeer.value - dissolvedCO2;
  }
  else { var primeAmount = co2Volume.options[co2Volume.selectedIndex].value * volBeer.value - dissolvedCO2; }
    var old_rows = document.querySelectorAll('.primingtable-result-row');
    if (old_rows.length) {
      for (var i = 0; i < old_rows.length; i++) {
        old_rows[i].remove();
      }
    }
   co2Factor = co2Volume.value - dissolvedCO2;
   volFactor = volBeer.value * 3.8;
   var primingtable = document.getElementById('primingtable');
   for (var i = 0; i < sugar_data.length; i++) {
     var _sugar = sugar_data[i];
     var new_row = document.createElement('tr');
     new_row.classList.add('primingtable-result-row');
     var new_title = document.createElement('td');
     var new_link = document.createElement('a');
     new_link.setAttribute('href', searchUrl + _sugar.search_term);
     new_link.innerHTML = _sugar.title;
     new_title.appendChild(new_link);
     new_row.appendChild(new_title);
     var new_grams = document.createElement('td');
     new_grams.innerHTML = ((co2Factor * _sugar.factor * volFactor) * _sugar.weightfactor).toFixed(SIGDIGITS);
     new_row.appendChild(new_grams);
     var new_ounce = document.createElement('td');
     new_ounce.innerHTML = (((co2Factor * _sugar.factor * volFactor) / 28.34952) * _sugar.weightfactor).toFixed(SIGDIGITS);
     new_row.appendChild(new_ounce);
     var new_cups = document.createElement('td');
     new_cups.innerHTML = (((co2Factor * _sugar.factor * volFactor) / _sugar.volumedivide ) * _sugar.volumefactor).toFixed(SIGDIGITS);
     new_row.appendChild(new_cups);
     primingtable.appendChild(new_row);
   }
}