var API_KEY = 'AIzaSyAcyZ9tMIOSmcqeZ_iDY0oEx4O7XaGYhD4';

Vue.use(VueGoogleMaps, {
    load: {
        key: API_KEY
    }
})

function new_waypoint(origin='', destination='') {
    return {
        origin: origin,
        destination: destination,
        distance: 0
    }
}

var app = new Vue({
    el: '#app',
    data: {
        message: 'שלום, עולם',
        total_km: 0,
        waypoints: [
            {
                origin: '',
                destination: '',
                distance: 0
            }
        ],
        day_time: 0,
        night_time: 0
    },
    computed: {
        total_distance: function() {
            var km =  this.waypoints.reduce(function(sum, val) {
                return sum + val.distance
            }, 0);

            return km / 1000;
        },
        total_time: function() {
            return parseInt(this.day_time) + parseInt(this.night_time);
        },
        km_price: function() {
            var FIRST_KMS = 50;
            var FIRST_MULT = 2;

            if (this.total_distance <= FIRST_KMS) {
                return this.total_distance * FIRST_MULT;
            }

            return FIRST_KMS * FIRST_MULT + (this.total_distance - FIRST_KMS);
        },
        time_price: function() {
            var DAY_TIME_PRICE = 20;
            var NIGHT_TIME_PRICE = DAY_TIME_PRICE / 2;
            var DAY_PRICE = 180;

            if (this.total_time > 9) {
                return DAY_PRICE;
            }

            return parseInt(this.day_time) * DAY_TIME_PRICE + parseInt(this.night_time) * NIGHT_TIME_PRICE;
        }
    },
    methods: {
        do_click: function(waypoint) {
            this.dir_service = new google.maps.DirectionsService();
            this.dir_renderer = new google.maps.DirectionsRenderer();
            this.dir_renderer.setMap(this.$refs.map.$mapObject);

            var vm = this;

            vm.dir_service.route({
                origin: waypoint.origin,
                destination: waypoint.destination,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    vm.dir_renderer.setDirections(response)
                    waypoint.distance += response.routes[0].legs[0].distance.value
                    vm.waypoints.push(new_waypoint(waypoint.destination, ''))
                } 
                else {
                    console.log('Directions request failed due to ' + status)
                }
            });
        }
    }
})