var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

//document.addEventListener("DOMContentLoaded", function(event) { 
//    if (window.location.href == 'http://localhost:3000/') {
//        carousel();
//    }
//});
var slideNum = 0;
var ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
$(document).ready(function() {

    // on certain links save the scroll postion.
    $('.saveScrollPostion').on("click", function (e) {
        var currentYOffset = window.pageYOffset;  // save current page postion.;
        document.cookie = 'jumpToScrollPostion=' + currentYOffset;
    });
    if (window.location.href == 'http://localhost:3000/') {
        carousel();
    }

    // check if we should jump to postion.
    if(document.cookie) {
        var allcookie = document.cookie;
        var cookieArray = allcookie.split(';');
        var value;
        if (cookieArray[0].split('=')[0] == 'jumpToScrollPostion') {
            value = cookieArray[0].split('=')[1];
        }
        window.scrollTo(0, value);
        delete_cookie('jumpToScrollPostion');
    };
    document.getElementById('id-cartclose').addEventListener('click', function() {
        closeCart();
    });
    
    document.getElementById('id-change').addEventListener('click', function() {
        console.log("window.history: ", window.history);
        window.history.back();
    });
    
//    $('button[form]').click(function (){        // To make it work on both HTML5 ready browser and IE, here is my jQuery 
//        var formId = $(this).attr('form'); 
//        $('#' + formId).submit(); 
//    });
});

function closeCart() {
    document.getElementById("id-cart").classList.remove('show');
    document.getElementById("id-menus").classList.remove('blur');
    document.getElementById("id-cart").classList.addClass('hide');
}

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