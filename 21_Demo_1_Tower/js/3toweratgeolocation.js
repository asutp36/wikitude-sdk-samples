var World = {
    /*
        User's latest known location, accessible via userLocation.latitude, userLocation.longitude,
         userLocation.altitude.
     */
    userLocation: null,

//    /* You may request new data from server periodically, however: in this sample data is only requested once. */
//    isRequestingData: false,

    /* True once data was fetched. */
    initiallyLoadedData: false,

    /* Different POI-Marker assets. */
    markerDrawableIdle: null,
    markerDrawableSelected: null,
    markerDrawableDirectionIndicator: null,

    /* List of AR.GeoObjects that are currently shown in the scene / World. */
    markerList: [],

//    /* the last selected marker. */
//    currentMarker: null,

//    init: function initFn() {
//        this.createModelAtLocation();
//    },
//
//    createModelAtLocation: function createModelAtLocationFn() {
//
//        /*
//            First a location where the model should be displayed will be defined. This location will be relativ to
//            the user.
//        */
////        var location = new AR.RelativeLocation(null, 50, -50, 0);
////        var location = new AR.GeoLocation(51.689153, 39.261848, 118);
//        var location = new AR.GeoLocation(51.689153, 39.261848, 0);
//
//        /* Next the model object is loaded. */
//        var modelEarth = new AR.Model("assets/House.wt3", {
//            onLoaded: this.worldLoaded,
//            onError: World.onError,
//            scale: {
//                x: 1,
//                y: 1,
//                z: 1
//            }
//        });
//
//        var indicatorImage = new AR.ImageResource("assets/indi.png", {
//            onError: World.onError
//        });
//
//        var indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
//            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
//        });
//
//        /* Putting it all together the location and 3D model is added to an AR.GeoObject. */
//        this.geoObject = new AR.GeoObject(location, {
//            drawables: {
//                cam: [modelEarth],
//                indicator: [indicatorDrawable]
//            }
//        });
//    },
//
//    worldLoaded: function worldLoadedFn() {
//        World.showUserMessage("Ready 6.");
//    },

    /* Called to inject new POI data. */
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

        /* Empty list of visible markers. */
        World.markerList = [];

        /* Start loading marker assets. */
        World.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
            onError: World.onError
        });
        World.markerDrawableSelected = new AR.ImageResource("assets/marker_selected.png", {
            onError: World.onError
        });
        World.markerDrawableDirectionIndicator = new AR.ImageResource("assets/indi.png", {
            onError: World.onError
        });

        /* Loop through POI-information and create an AR.GeoObject (=Marker) per POI. */
        for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
            var singlePoi = {
                "id": poiData[currentPlaceNr].id,
                "latitude": parseFloat(poiData[currentPlaceNr].latitude),
                "longitude": parseFloat(poiData[currentPlaceNr].longitude),
                "altitude": parseFloat(poiData[currentPlaceNr].altitude),
                "title": poiData[currentPlaceNr].name,
                "description": poiData[currentPlaceNr].description
            };

            World.markerList.push(new Marker(singlePoi));
        }

        World.showUserMessage(currentPlaceNr + ' places loaded');
    },

    /* Request POI data. */
    requestDataFromLocal: function requestDataFromLocalFn(lat, lon) {

//        var poisNearby = Helper.bringPlacesToUser(myJsonData, lat, lon);
//        World.loadPoisFromJsonData(poisNearby);

        World.loadPoisFromJsonData(myJsonData);
    },

    locationChanged: function locationChangedFn(lat, lon, alt, acc) {
//        World.showUserMessage("lat: " + lat + " lon: " + lon + " alt: " + alt + " acc: " + acc);

        /* Store user's current location in World.userLocation, so you always know where user is. */
        World.userLocation = {
            'latitude': lat,
            'longitude': lon,
            'altitude': alt,
            'accuracy': acc
        };


        /* Request data if not already present. */
        if (!World.initiallyLoadedData) {
            World.requestDataFromLocal(lat, lon);
            World.initiallyLoadedData = true;
         }
//        } else if (World.locationUpdateCounter === 0) {
//            /*
//                Update placemark distance information frequently, you max also update distances only every 10m with
//                some more effort.
//             */
//            World.updateDistanceToUserValues();
//        }
//
//        /* Helper used to update placemark information every now and then (e.g. every 10 location upadtes fired). */
//        World.locationUpdateCounter =
//            (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);
    },

    showUserMessage: function showUserMessageFn(message) {
        document.getElementById('loadingMessage').innerHTML = message;
    },

    onError: function onErrorFn(error) {
        alert(error);
    }
};

//var Helper = {
//
//    /*
//        For demo purpose only, this method takes poi data and a center point (latitude, longitude) to relocate the
//        given places randomly around the user
//    */
//    bringPlacesToUser: function bringPlacesToUserFn(poiData, latitude, longitude) {
//        for (var i = 0; i < poiData.length; i++) {
//            poiData[i].latitude = latitude;
//            poiData[i].longitude = longitude;
//            poiData[i].altitude = 0;
//
////            poiData[i].latitude = latitude + (Math.random() / 5 - 0.1);
////            poiData[i].longitude = longitude + (Math.random() / 5 - 0.1);
////            /*
////                Note: setting altitude to '0' will cause places being shown below / above user, depending on the
////                user 's GPS signal altitude. Using this contant will ignore any altitude information and always
////                show the places on user-level altitude.
////            */
////            poiData[i].altitude = AR.CONST.UNKNOWN_ALTITUDE;
//        }
//        return poiData;
//    }
//};


//World.init();

/* Forward locationChanges to custom function. */
AR.context.onLocationChanged = World.locationChanged;

/* Forward clicks in empty area to World. */
AR.context.onScreenClick = World.onScreenClick;