const state = {
  userLat: {},
	userLng: {},
  selectedJob: '',
  jobsToCheck: {},
	practicesOfSelectedJob: []
};

function callToBetterDoctorAPI(lat, lng) {
  let BETTER_DOCTOR_ENDPOINT = `https://api.betterdoctor.com/2016-03-01/practices?location=${lat},${lng},20&sort=distance-asc&skip=0&limit=5&user_key=bd89718570bb0b867674b0c0788273da`;
  $.get(BETTER_DOCTOR_ENDPOINT, function (data) {
  	pushDoctorsWhichJobsMatchSelected(data);
  });
}

function handleDoctorJobSelection() {
  $('#jobs').change(function() {
    let selectedJob = $('#jobs option:selected').text();
    console.log(selectedJob);
    if(selectedJob === '') {
      state.selectedJob == false; 
    } else {
      state.selectedJob = selectedJob;
    }
  });
}

function pushDoctorsWhichJobsMatchSelected(apiResults) {
  const jobsArr = [];
	apiResults.data.forEach(result => {
		result.doctors.forEach(doctor => {
			doctor.specialties.forEach(skill => {
				if(skill.actor === state.selectedJob) {
					state.practicesOfSelectedJob.push(result);
				}
			})
		})
	})
}

function findCurrentLocationButton() {
	$('.js-current-location').on('click', function(event) {
		$('.map').removeClass('hidden');
		$('.specialty-header').removeClass('hidden');
		initMap();
	});
}

function findUserPosition() {
navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      state.userLat = pos.lat;
      state.userLng = pos.lng;

      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      infoWindow.open(map);
      map.setCenter(pos);
      
      callToBetterDoctorAPI(state.userLat, state.userLng);
      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
}


var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8781, lng: -87.6298},
    zoom: 11
  });
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    findUserPosition();
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function createMarkers() {
	var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
}




// function callDataFromBetterDoctors(dataResult) {
//to be pushed into state.practicesOfSelectedJob
// }


// Possible need for recursion

// var inception = function(arr) {
//   let levels = 1;
//   if(typeof arr[0] !== 'object') {
//     return levels;
//   } else {
//     return levels += inception(arr[0])
//   }
// }
// inception([[['leo']]])




// function renderDivToHTML(docImg, doc) {
// 	return `
// 		<div class='display-of-doctors'>
// 			<div class='doctor-profile'>

// 			</div>
// 		</div>
// 	`;
// }







$(handleDoctorJobSelection);
$(findCurrentLocationButton);




