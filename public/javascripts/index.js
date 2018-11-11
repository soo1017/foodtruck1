var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
var slideNum = 0;
var ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
$(document).ready(function() {
    // on certain links save the scroll postion.
    $('.saveScrollPostion').on("click", function (e) {
        var currentYOffset = window.pageYOffset;  // save current page postion.;
        document.cookie = 'jumpToScrollPostion=' + currentYOffset;
    });
    carousel();
    
    if (window.location.href == 'http://localhost:3000/' || window.location.href == 'http://localhost:3000/#id-menus' || window.location.href == 'http://localhost:3000/#id-foodtruck') {
        if (getFoodTruckAddress() != 'Off') {
            ft_address = getFoodTruckAddress();
        } else {
            ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
        }
//        var headerHeight = $('.cls-bgimage').height() + 'px';
//        console.log("headerHeight", headerHeight);
//        if (headerHeight != "0px") {
//            $('.cls-section-foodtruck').css('margin-top', headerHeight);
//        }
    }

    // check if we should jump to postion.
    if(document.cookie) {
        var allcookie = document.cookie;
        console.log("allcookie: ", allcookie);
        var cookieArray = allcookie.split(';');
        var value;
        if (cookieArray[0].split('=')[0] == 'jumpToScrollPostion') {
            value = cookieArray[0].split('=')[1];
        }
        window.scrollTo(0, value);
        delete_cookie('jumpToScrollPostion');
    };
    if (document.getElementById('id-change')) {
        document.getElementById('id-change').addEventListener('click', function() {
            if (document.getElementById('id-pickuploc').innerHTML == "Restaurant") {
                document.getElementById('id-pickuploc').innerHTML = "Food Truck";
            } else {
                document.getElementById('id-pickuploc').innerHTML = "Restaurant";
            }
        });
    }
    
    if (document.getElementById('id-navcart')) {
        document.getElementById('id-navcart').addEventListener('click', function() {
            var x = document.getElementById('id-shoppingcart').className;
            var arr_class = x.split(" ");
            var string_url = window.location.href;
            var user_string = string_url.match(/http\:\/\/localhost\:3000\/user/g);
            var checkout_string = string_url.match(/http\:\/\/localhost\:3000\/shop\/checkout/g);
            var thanks_string = string_url.match(/http\:\/\/localhost\:3000\/shop\/thanks/g);

            if (user_string === null || user_string.length == 0) {      // Not User
                if ( checkout_string === null || checkout_string.length == 0) { // Not CheckOut
                    if (thanks_string === null || thanks_string.length == 0) {
                        for (var i=0; i<arr_class.length; i++) {
                            if (arr_class[i] == 'show') {
                                document.getElementById('id-shoppingcart').classList.remove("show");
                                document.getElementById('id-shoppingcart').classList.add("hide");
                            } else if (arr_class[i] == 'hide') {
                                document.getElementById('id-shoppingcart').classList.remove("hide");
                                document.getElementById('id-shoppingcart').classList.add("show");
                            } else {
                            }
                        }
                    }
                }
            } 
        });
    }
    if (document.getElementById('id-cartclose')) {
        document.getElementById('id-cartclose').addEventListener('click', function() {
            document.getElementById('id-shoppingcart').classList.remove("show");
            document.getElementById('id-shoppingcart').classList.add("hide");
    //        delete_cookie('currUrl');
        });
    }
    
//    $('button[form]').click(function (){        // To make it work on both HTML5 ready browser and IE, here is my jQuery 
//        var formId = $(this).attr('form'); 
//        $('#' + formId).submit(); 
//    });
    
    //// Admin Order Monitor
    /////////////////////////////////////
    $(document).on('click', '#id-extend', function() {      // $('#id-extend').on('click', ...) not working on elements within handlerbar
        flipExtend(this);
    });
    
    $(document).on('click', '#id-complete', function() {
        completeOrder(this);
    });
    
    $(document).on('click', '#id-close', function() {
        closeOneItem(this);
    });
    setInterval(function(){
       $('.sign-monitor').load('/admin/monitor/order-update');
    }, 10000) /* time in milliseconds (ie 2 seconds)*/
});

// Helper Function
///////////////////////////
Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});


// Function
///////////////////////////
function carousel() {
    var i;
    var x = document.getElementsByClassName("cls-slides");
    var dots = document.getElementsByClassName("demo");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    slideNum++;
    if (slideNum > x.length) {slideNum = 1} 
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" cls-white", "");
    }
    x[slideNum-1].style.display = "block"; 
    dots[slideNum-1].className += " cls-white";
    setTimeout(carousel, 4000); // Change image every 2 seconds
}

function currentDiv(n) {
    showDivs(slideNum = n);
}

function showDivs(n) {
    console.log("slideNum: ", slideNum);
    var i;
    var x = document.getElementsByClassName("cls-slides");
    var dots = document.getElementsByClassName("demo");
    if (n > x.length) {slideNum = 1}    
    if (n < 1) {slideNum = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" cls-white", "");
    }
    x[slideNum-1].style.display = "block";  
    dots[slideNum-1].className += " cls-white";
}

function initMap() {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': ft_address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
        }
        var myLatLng = {lat: latitude, lng: longitude};
    
        var styledMapType = new google.maps.StyledMapType(
            [
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ],
            {name: 'Styled Map'});
        
        /****************/
        var map = new google.maps.Map(document.getElementById('id-map'), {
            zoom: 14,
            center: myLatLng,
            mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
        });
        
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        var image1 = '/images/food-truck.png';
        marker = new google.maps.Marker({
            map: map,
//            icon: iconBase + 'parking_lot_maps.png',
            icon: image1,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: myLatLng
    //        position: {lat: 59.327, lng: 18.067}
        });
        marker.addListener('click', toggleBounce);
    });
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function getFoodTruckAddress() {
    var day, address_temp, link, element_temp1, element_temp2;
    switch (new Date().getDay()) {
        case 0:
            day = "Sunday";
            link = document.getElementsByClassName("cls-span-calendar")[5];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementById("id-weekend");
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case 1:
            day = "Monday";
            link = document.getElementsByClassName("cls-span-calendar")[0];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[0];
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case 2:
            day = "Tuesday";
            link = document.getElementsByClassName("cls-span-calendar")[1];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[1];
            element_temp1.classList.add("cls-calendar-bold");
//            element_temp2 = document.getElementsByClassName("cls-calendar-li")[0];
//            element_temp2.classList.remove("cls-calendar-bold");
            break;
        case 3:
            day = "Wednesday";
            link = document.getElementsByClassName("cls-span-calendar")[2];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[2];
            element_temp1.classList.add("cls-calendar-bold");
//            element_temp2 = document.getElementsByClassName("cls-calendar-li")[1];
//            element_temp2.classList.remove("cls-calendar-bold");
            break;
        case 4:
            day = "Thursday";
            link = document.getElementsByClassName("cls-span-calendar")[3];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[3];
            element_temp1.classList.add("cls-calendar-bold");
//            element_temp2 = document.getElementsByClassName("cls-calendar-li")[2];
//            element_temp2.classList.remove("cls-calendar-bold");
            break;
        case 5:
            day = "Friday";
            link = document.getElementsByClassName("cls-span-calendar")[4];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[4];
            element_temp1.classList.add("cls-calendar-bold");
//            element_temp2 = document.getElementsByClassName("cls-calendar-li")[3];
//            element_temp2.classList.remove("cls-calendar-bold");
            break;
        case  6:
            day = "Saturday";
            link = document.getElementsByClassName("cls-span-calendar")[5];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementById("id-weekend");
            element_temp1.classList.add("cls-calendar-bold");
//            element_temp2 = document.getElementsByClassName("cls-calendar-li")[4];
//            element_temp2.classList.remove("cls-calendar-bold");
    }
    return ft_address;
}


//// Admin Order Monitor
/////////////////////////////////////
function flipExtend(tis) {
    var parentElem = tis.parentNode.parentNode;                     // P element
    var completeIcon = parentElem.children[1].firstChild;           // <span> Checkbox
    var granParentElem = parentElem.parentNode;                     // DIV .order-id
    var nextSibling = granParentElem.nextElementSibling;        // Li
    if (completeIcon.name == 'checkbox-outline') {
        if (tis.name == 'arrow-dropleft') {        
            nextSibling.classList.remove("hide");
            nextSibling.classList.add("show");
            tis.name = 'arrow-dropdown';
        } else {
            nextSibling.classList.remove("show");
            nextSibling.classList.add("hide");
            tis.name = 'arrow-dropleft';
        }
    }
}

function completeOrder(tis) {
    var parentElem = tis.parentNode.parentNode;                        // P element
    var granParentElem = parentElem.parentNode;                         // DIV .order-id
    var secondDiv = granParentElem.children[1];
    var firstIcon = parentElem.firstChild;
    if (tis.name == 'checkbox-outline') {
        parentElem.style.backgroundColor = 'rgba(0, 128, 0, 0.46)';    //green
        tis.name = 'checkbox';
        secondDiv.classList.add("hide");
//        secondDiv.style.display = 'none';
        firstIcon.name = 'arrow-dropright';
    } else {
        parentElem.style.backgroundColor = 'rgba(235, 249, 66, 0.3)';
        tis.name = 'checkbox-outline';
    }
}

function closeOneItem(tis) {
    var deletedLi = tis.parentNode.parentNode;
    var totalPrice0 = deletedLi.parentNode.parentNode;
    var totalPrice1 = totalPrice0.parentNode;
    var totalPrice = totalPrice1.nextElementSibling;
    var completeIcon = deletedLi.children[1].firstChild;
    console.log("deletedLi: ", deletedLi);
    console.log("completeIcon: ", completeIcon);
    if (completeIcon.name == 'checkbox') {
        var ret1 = confirm("Are you sure?");
        if (ret1 == true) {
            deletedLi.remove();
            totalPrice.classList.add('hide');
        }
    }
}
