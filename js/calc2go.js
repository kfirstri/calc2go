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
        start_time: '',
        end_time: ''
    },
    computed: {
        total_distance: function() {
            var km =  this.waypoints.reduce(function(sum, val) {
                return sum + val.distance
            }, 0);

            return km / 1000;
        },
        total_time: function() {
            return Math.ceil(moment(this.end_time).diff(moment(this.start_time), 'hours', 'minutes'))
        },
        km_price: function() {
            var FIRST_KM = 50;
            var FIRST_MULT = 2;

            if (this.total_distance <= FIRST_KM) {
                return this.total_distance * FIRST_MULT;
            }

            return FIRST_KM * FIRST_MULT + (this.total_distance - FIRST_KM);
        },
        hours_at_night: function() {
            
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