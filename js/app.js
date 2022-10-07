//Initialisation carte map

var map = L.map('map', { zoomControl: false }).setView([-18.8724342 , 47.5177325 ], 6);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 20
});

osm.addTo(map);

// Street Layer
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleStreets.addTo(map);

// Satelite Layer
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleSat.addTo(map);

var baseLayers = {
    "Google Map": googleStreets,
    "OpenStreetMap": osm,
    "Satellite": googleSat
};

L.control.layers(baseLayers).addTo(map);

L.control.scale({ position: 'bottomright',imperial :false }).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

/*
if (!navigator.geolocation) {
    console.log("Your browser doesn't support geolocation feature!")
} else {
    setInterval(() => {
        navigator.geolocation.getCurrentPosition(getPosition)
        
    }, 5000);
}
*/

var marker, circle;

function getPosition(position) {
    // console.log(position)
    var lat = position.coords.latitude
    var long = position.coords.longitude
    var accuracy = position.coords.accuracy

    if (marker) {
        map.removeLayer(marker)
    }

    if (circle) {
        map.removeLayer(circle)
    }

    marker = L.marker([lat, long])
    circle = L.circle([lat, long], { radius: accuracy })

    var featureGroup = L.featureGroup([marker, circle]).addTo(map)

    map.fitBounds(featureGroup.getBounds())

    console.log("Your coordinate is: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy)
}

function setMarker(latitude,longitude, titre) {
    
    var singleMarker = L.marker([latitude, longitude]);
    singleMarker.addTo(map);
    let popup = singleMarker.bindPopup('<div style = "margin-bottom:10px;"><strong> '+titre+'</strong></div> <div><i > Latitude : ' + latitude + ' </i></div><br></div> <div><i > Longitude : ' + longitude + ' </i></div>');
    popup.addTo(map);
    singleMarker.on('mouseover', () => popup.openPopup());
    singleMarker.on('mouseout', () => popup.closePopup());
   
}

function getData() {
    
    var arr = [];
    fetch('http://localhost:3000/show')
        .then(result => result.json())
        .then(result => {
            var cmpt =0;
            for (var res of result){
                if(cmpt>=119){
                    arr.push([res.latitude,res.longitude]);
                }
                cmpt++;
            }
            console.log(arr);
            setMarker(arr[0][0],arr[0][1], 'Départ');

            traceLine(arr)
            setMarker(arr[1500][0],arr[1500][1] , '15087 TBL')
            setMarker(arr[arr.length-1][0],arr[arr.length-1][1] , 'Arrivée');
        });
}

function traceLine(data) {
    var latlngs = [
        [45.51, -122.68],
        [37.77, -122.43],
        [34.04, -118.2]
    ];
    var polyline = L.polyline(data, { color: 'red', weight: 4, opacity: 0.5,smoothFactor: 1 }).addTo(map);

    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
}
//traceLine();
//getData();

function device(){
    document.querySelector(".appareil").style.display="inline-block";
    document.querySelector(".sidenav").style.display="none";
    //document.querySelector("#map").style.opacity="0.5";
    
}
function parametre(){
    document.querySelector(".parametre").style.display="inline-block";
    document.querySelector(".sidenav").style.display="none";
    //document.querySelector("#map").style.opacity="0.5";
    
}

function el_close(){
    document.querySelector(".device").style.display="none";
    document.querySelector("#map").style.opacity="1";
}
function create_app(){
    document.querySelector(".device").style.display="inline-block";
}

function quit_app(){
    document.querySelector(".appareil").style.display="none";
    document.querySelector(".sidenav").style.display="block";
}

function quit_param(){
    document.querySelector(".parametre").style.display="none";
    document.querySelector(".sidenav").style.display="block";
}


var dropdown = document.getElementsByClassName("dropdown-btn");

for (var i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}