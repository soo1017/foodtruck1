var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
var slideNum = 0;
var ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
$(document).ready(function() {
    // on certain links save the scroll postion.
    $('.saveScrollPosition').on("click", function (e) {
<<<<<<< HEAD
        var currentYOffset = window.pageYOffset;  // save current page postion.;
        document.cookie = 'jumpToScrollPosition=' + currentYOffset;
    });
    carousel();
    
    if (window.location.href == 'http://localhost:3000' || window.location.href == 'http://localhost:3000/' || window.location.href == 'http://localhost:3000/#id-menus' || window.location.href == 'http://localhost:3000/#id-foodtruck') {
        if (getFoodTruckAddress() != 'Off') {
            ft_address = getFoodTruckAddress();
        } else {
            ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
        }
=======
//        e.preventDefault();
        var currentYOffset = window.pageYOffset;  // save current page postion.;    
        document.cookie = 'jumpToScrollPosition=' + currentYOffset;
    });
    carousel();

    if (getFoodTruckAddress() == 'Off') {
        ft_address = '33592 Alvarado-Niles Rd, Union City, CA';
    } else {
        ft_address = getFoodTruckAddress();
>>>>>>> 2nd commit
    }


    // check if we should jump to postion.
    if(document.cookie) {
        var allcookie = document.cookie;
        var cookieArray = allcookie.split(';');
        var value;
        for (var i=0; i<cookieArray.length; i++) {
<<<<<<< HEAD
            if (cookieArray[i].split('=')[0] == 'jumpToScrollPosition' && cookieArray[i].split('=')[1] != '0') {
=======
            if (cookieArray[i].split('=')[0] == 'jumpToScrollPosition' && cookieArray[i].split('=')[1] != 0) {
>>>>>>> 2nd commit
                value = cookieArray[i].split('=')[1];
                break;
            }
        }
        window.scrollTo(0, value);
        delete_cookie('jumpToScrollPosition');
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
    
    $(document).bind( "mouseup touchend", function(e){
        if (!$('#id-shoppingcart').is(e.target) // if the target of the click isn't the container...
                && $('#id-shoppingcart').has(e.target).length === 0) // ... nor a descendant of the container
        {
            document.getElementById('id-shoppingcart').classList.remove("show");
            document.getElementById('id-shoppingcart').classList.add("hide");
        }
        if (!$('#id-mobile-menu-ul').is(e.target) // if the target of the click isn't the container...
                && $('#id-mobile-menu-ul').has(e.target).length === 0) // ... nor a descendant of the container
        {
            document.getElementById('id-mobile-menu-ul').classList.remove("show");
            document.getElementById('id-mobile-menu-ul').classList.add("hide");
        }
    });
    
    
    if (document.getElementById('id-navcart')) {
        document.getElementById('id-navcart').addEventListener('click', function(e) {
//            e.preventDefault();
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
                                
                                document.getElementById('id-mobile-menu-ul').classList.remove("show");
                                document.getElementById('id-mobile-menu-ul').classList.add("hide");
                                document.getElementById('id-mobile-menu').name = "menu";
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
    
    // Media Queries
    $('.js--mobile-btn').click(function() {
        var nav = $('.js--main-div');
        var icon = $('.js--mobile-btn i');

        // nav.slideToggle(200);
        if (nav.css('display') == 'none') {
            nav.css('display', 'block');
            $('.main-nav11').css('display', 'block');
        } else {
            nav.css('display', 'none');
            $('.main-nav11').css('display', 'none');
        }
        $('.cls-more').css('display', 'none');
        
        if (icon.hasClass('ion-navicon-round')) {
            icon.addClass('ion-close-round');
            icon.removeClass('ion-navicon-round');
        } else {
            icon.addClass('ion-navicon-round');
            icon.removeClass('ion-close-round');
        }
    });
    
    //// Mobile
    /////////////////////////////////////
    if (document.getElementById('id-mobile-menu')) {
        document.getElementById('id-mobile-menu').addEventListener('click', function(e) {
            e.preventDefault();
            var x = document.getElementById('id-mobile-menu-ul').className;
            var arr_class1 = x.split(" ");
            for (var i=0; i<arr_class1.length; i++) {
                if (arr_class1[i] == 'show') {
                    document.getElementById('id-mobile-menu-ul').classList.remove("show");
                    document.getElementById('id-mobile-menu-ul').classList.add("hide");
                    this.name = "menu";
                } else if (arr_class1[i] == 'hide') {
                    document.getElementById('id-mobile-menu-ul').classList.remove("hide");
                    document.getElementById('id-mobile-menu-ul').classList.add("show");
                    this.name = "close";
                    
                    document.getElementById('id-shoppingcart').classList.remove("show");
                    document.getElementById('id-shoppingcart').classList.add("hide");
                } else {
                }
            }
        });
    }
});

// Helper Function
///////////////////////////
Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});


// Function
///////////////////////////
var tempNum = 0;
function carousel() {
    var x = [];
    
    if (document.getElementsByClassName("cls-slides1")[tempNum]) {
        if (document.getElementsByClassName("cls-slides1")[tempNum].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides1");
        }
    }
    if (document.getElementsByClassName("cls-slides2")[tempNum]) {
        if (document.getElementsByClassName("cls-slides2")[tempNum].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides2");
        }
    }
    if (document.getElementsByClassName("cls-slides3")[tempNum]) {
        if (document.getElementsByClassName("cls-slides3")[tempNum].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides3");
        }
    }
    if (document.getElementsByClassName("cls-slides4")[tempNum]) {
        if (document.getElementsByClassName("cls-slides4")[tempNum].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides4");
        }
    }
    
    var dots = document.getElementsByClassName("demo");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    slideNum++;
    if (slideNum > x.length) {slideNum = 1} 
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" cls-white", "");
    }
    tempNum = slideNum - 1;
    if (x[slideNum-1]) {
        x[slideNum-1].style.display = "block"; 
    }
    if (dots[slideNum-1]) {
        dots[slideNum-1].className += " cls-white";
    }
    setTimeout(carousel, 5000); // Change image every 5 seconds
}

function currentDiv(n) {
    showDivs(slideNum = n);
}

function showDivs(n) {
    var i, x;
    for (var j=0; j<3; j++) {
        if (document.getElementsByClassName("cls-slides1")[j].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides1");
            break;
        }
    }
    for (var j=0; j<3; j++) {
        if (document.getElementsByClassName("cls-slides2")[j].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides2");
            break;
        }
    }
    for (var j=0; j<3; j++) {
        if (document.getElementsByClassName("cls-slides3")[j].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides3");
            break;
        }
    }
    for (var j=0; j<3; j++) {
        if (document.getElementsByClassName("cls-slides4")[j].offsetWidth != '0') {
            x = document.getElementsByClassName("cls-slides4");
            break;
        }
    }

    var dots = document.getElementsByClassName("demo");
    if (n > x.length) {slideNum = 1}    
    if (n < 1) {slideNum = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" cls-white", "");
    }
    tempNum = slideNum - 1;
    if (x[slideNum-1]) {
        x[slideNum-1].style.display = "block";  
    }
    if (dots[slideNum-1]) {
        dots[slideNum-1].className += " cls-white";
    }
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
<<<<<<< HEAD
            link = document.getElementsByClassName("cls-span-calendar")[5];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementById("id-weekend");
            element_temp1.classList.add("cls-calendar-bold");
=======
            if (document.getElementsByClassName("cls-span-calendar")[5]) {
                link = document.getElementsByClassName("cls-span-calendar")[5];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            if (element_temp1 = document.getElementById("id-weekend")) {
                element_temp1 = document.getElementById("id-weekend");
                element_temp1.classList.add("cls-calendar-bold");
            }
>>>>>>> 2nd commit
            break;
        case 1:
            day = "Monday";
            if (document.getElementsByClassName("cls-span-calendar")[0]) {
                link = document.getElementsByClassName("cls-span-calendar")[0];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            
            if (document.getElementsByClassName("cls-calendar-li")[0]) {
                element_temp1 = document.getElementsByClassName("cls-calendar-li")[0];
                element_temp1.classList.add("cls-calendar-bold");
            }
            break;
        case 2:
            day = "Tuesday";
            if (document.getElementsByClassName("cls-span-calendar")[1]) {
                link = document.getElementsByClassName("cls-span-calendar")[1];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            
<<<<<<< HEAD
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[1];
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case 3:
            day = "Wednesday";
            link = document.getElementsByClassName("cls-span-calendar")[2];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[2];
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case 4:
            day = "Thursday";
            link = document.getElementsByClassName("cls-span-calendar")[3];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[3];
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case 5:
            day = "Friday";
            link = document.getElementsByClassName("cls-span-calendar")[4];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementsByClassName("cls-calendar-li")[4];
            element_temp1.classList.add("cls-calendar-bold");
            break;
        case  6:
            day = "Saturday";
            link = document.getElementsByClassName("cls-span-calendar")[5];
            address_temp = link.innerText || link.textContent;
            ft_address = address_temp.replace("'", "");
            
            element_temp1 = document.getElementById("id-weekend");
            element_temp1.classList.add("cls-calendar-bold");
=======
            if (document.getElementsByClassName("cls-calendar-li")[1]) {
                element_temp1 = document.getElementsByClassName("cls-calendar-li")[1];
                element_temp1.classList.add("cls-calendar-bold");
            }
            break;
        case 3:
            day = "Wednesday";
            if (document.getElementsByClassName("cls-span-calendar")[2]) {
                link = document.getElementsByClassName("cls-span-calendar")[2];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            if (document.getElementsByClassName("cls-calendar-li")[2]) {
                element_temp1 = document.getElementsByClassName("cls-calendar-li")[2];
                element_temp1.classList.add("cls-calendar-bold");
            }
            break;
        case 4:
            day = "Thursday";
            if (document.getElementsByClassName("cls-span-calendar")[3]) {
                link = document.getElementsByClassName("cls-span-calendar")[3];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            if (document.getElementsByClassName("cls-calendar-li")[3]) {
                element_temp1 = document.getElementsByClassName("cls-calendar-li")[3];
                element_temp1.classList.add("cls-calendar-bold");
            }
            break;
        case 5:
            day = "Friday";
            if (document.getElementsByClassName("cls-span-calendar")[4]) {
                link = document.getElementsByClassName("cls-span-calendar")[4];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            if (document.getElementsByClassName("cls-calendar-li")[4]) {
                element_temp1 = document.getElementsByClassName("cls-calendar-li")[4];
                element_temp1.classList.add("cls-calendar-bold");
            }
            break;
        case  6:
            day = "Saturday";
            if (document.getElementsByClassName("cls-span-calendar")[5]) {
                link = document.getElementsByClassName("cls-span-calendar")[5];
                address_temp = link.innerText || link.textContent;
                ft_address = address_temp.replace("'", "");
            }
            if (document.getElementById("id-weekend")) {
                element_temp1 = document.getElementById("id-weekend");
                element_temp1.classList.add("cls-calendar-bold");
            }
>>>>>>> 2nd commit
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
    if (completeIcon.name == 'checkbox') {
        var ret1 = confirm("Are you sure?");
        if (ret1 == true) {
            deletedLi.remove();
            totalPrice.classList.add('hide');
        }
    }
}

//        var headerHeight = $('.cls-bgimage').height() + 'px';
//        console.log("headerHeight", headerHeight);
//        if (headerHeight != "0px") {
//            $('.cls-section-foodtruck').css('margin-top', headerHeight);
//        }
<<<<<<< HEAD
=======

//    if ($("#id-shoppingcart").hasClass("show")) {
//        $(document).on('click', function(event) {
//            console.log("hi");
//            console.log("length: ", $(event.target).closest('#id-shoppingcart').length);
//            console.log("true: ", $("#id-shoppingcart").hasClass("show"));
//            if (!$(event.target).closest('#id-shoppingcart').length && $("#id-shoppingcart").hasClass("show")) {
//                console.log("hihi");
//                document.getElementById('id-shoppingcart').classList.remove("show");
//                document.getElementById('id-shoppingcart').classList.add("hide");
//            } 
//        });
//    }

    
//    $('button[form]').click(function (){        // To make it work on both HTML5 ready browser and IE, here is my jQuery 
//        var formId = $(this).attr('form'); 
//        $('#' + formId).submit(); 
//    });
>>>>>>> 2nd commit
