import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from "@angular/router";
import {
	FormGroup,
	FormControl,
	Validators,
	FormArray
} from "@angular/forms";
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import { LocationDataService, 
	AirlineDataService, 
	BookingDataService, 
	BookingDetailDataService,
	ContactDataService,
	PassengerDataService
} from '../../shared';

import { Contact } from '../../models';
import { Configuration } from '../../shared/app.configuration';
declare let moment: any;
declare let jQuery: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [LocationDataService, AirlineDataService, BookingDataService, BookingDetailDataService, 
	  ContactDataService, PassengerDataService]
})
export class SearchResultComponent implements OnInit, AfterViewInit {

	people = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	listRoutes = [];
	locations = [];
	flightsFromDate = [];
	flightsToDate = [];
	session_flight = {};
	round_trip = false;
	selectedFlights = {};
	roundTripOptions = {};
	selectedStep = 0;
	sort: any;
	lowestFilter = {};
	steps = [];
	search: any;
	contact = {};
	session_token: string;
	passengers = [];
	airlines = {};
	airlineOptions = {};

	adultOptions = [];
	childrenOptions = [];
	infantOptions = [];
	titleOptions = [];

	curRouting?: string;

	constructor(
		private _AirlineDataService: AirlineDataService, 
		private _LocationDataService: LocationDataService,
		private _BookingDataService: BookingDataService,
		private _ContactDataService: ContactDataService,
		private _BookingDetailDataService: BookingDetailDataService,
		private _PassengerDataService: PassengerDataService,
		private sessionStorage: LocalStorageService, 
		private _ActivatedRoute: ActivatedRoute, 
		private _Router: Router,
		private _Configuration: Configuration
	) { 
		moment.locale('vi');

		this._ActivatedRoute.params.subscribe(
			(param: any) => this.session_token = param['session_token']
		);

		
		this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});

		let session_token = this.sessionStorage.get('session_token');

		this.roundTripOptions = {
			on: 'Khứ hồi',
			off: 'Một chiều',
			mul: 'Nhiều chặng'
		}

		this.steps = [
			{ id: 1, name: 'Tìm chuyến bay' },
			{ id: 2, name: 'Thông tin hành khác và chuyến bay' },
			{ id: 3, name: 'Xác nhận & Thanh toán' },

		];

		this.titleOptions['adult'] = [
			{ id: 1, name: 'Ông' },
			{ id: 2, name: 'Bà' },
			{ id: 3, name: 'Anh' },
			{ id: 4, name: 'Chị' }
		];

		this.titleOptions['children'] = [
			{ id: 5, name: 'Bé Trai' },
			{ id: 6, name: 'Bé Gái' }
		];

		this.titleOptions['infant'] = [
			{ id: 7, name: 'Em Bé Trai' },
			{ id: 8, name: 'Em Bé Gái' }
		];

		this.airlineOptions = {
			vietjet:true,
			jetstar: true,
			vna: true

		};

	}

  	ngOnInit() {

		this.searchingData();

		// Get locations
		this._LocationDataService.getAll().subscribe(res => {

			if (res.data) {
				var locations = [];
				for (var key in res.data) {

					var temp = {
						value: res.data[key].code,
						label: res.data[key].name
					};
					locations.push(temp);

				}
				this.locations = locations;
			}

		});
  	}

  	searchingData() {
		var params = this.sessionStorage.get('session_flight');

		this.session_flight = JSON.parse(String(params));

		let format_day = 'dddd, DD/MM/YYYY';

		this.search = this.clone(this.session_flight);

		this.search['from_day'] = moment(this.search['from_date']).format(format_day);
		if (this.search['to_date']) {
			this.search['to_day'] = moment(this.search['to_date']).format(format_day);
		}
  	}

  	initData() {
		this.searchingData();


		// Combine fork join 3 airlines
		const vietjet$ = this._AirlineDataService.vietjet(this.session_flight).cache();

		const jetstar$ = this._AirlineDataService.jetstar(this.session_flight).cache();

		const vna$ = this._AirlineDataService.vna(this.session_flight).cache();

		Observable.forkJoin(vietjet$, jetstar$, vna$).subscribe(res => {


			this.airlines['vietjet'] = res[0];
			this.airlines['jetstar'] = res[1];
			this.airlines['vna'] = res[2];

			this.lowestFilter['vietjet'] = this.getLowestPrice(this.airlines['vietjet'].dep_flights);
			this.lowestFilter['jetstar'] = this.getLowestPrice(this.airlines['jetstar'].dep_flights);
			this.lowestFilter['vna'] = this.getLowestPrice(this.airlines['vna'].dep_flights);
			this.filterAirlines();
			this.selectedStep = 1;
			this.sortTime();
			this.sort = 'time';

		});
  	}

	ngAfterViewInit() {
		var params = this.sessionStorage.get('session_flight');

		let session_flight = JSON.parse(String(params));
		setTimeout(function() {
			jQuery('.select2').select2();
			jQuery('#date-go input').val(session_flight['from_date']);
			if (session_flight['to_date']) {
				jQuery('#date-back input').val(session_flight['to_date']);
			}

			jQuery(".select-adult, .select-child-1, .select-child-2").select2({
				width: '100%',
				minimumResultsForSearch: -1
			});

			jQuery('.date').datetimepicker({
				format: 'DD/MM/YYYY',
				allowInputToggle: true
			});

		}, 1000);

		setTimeout(function() {

			jQuery('.btn-select-flight').click(function() {
				if (!jQuery(this).closest('.flights').hasClass('selected')) {
					jQuery(this).closest('.flights').addClass('selected');
					if (jQuery('.flights.selected').length < jQuery('.flights').length) {
						jQuery('.flights').each(function(i) {
							if (!jQuery('.flights').eq(i).hasClass('selected')) {
								jQuery('html, body').animate({
									scrollTop: jQuery('.flights').eq(i).offset().top
								}, 500);
								return false;
							}
						})
					} else {
						alert('Redirect to confirm page');
					}
				}
			});

		}, 5000);
		
	}

	updateCheckedOptions(option, event) {
		this.airlineOptions[option] = event.target.checked;
		this.filterAirlines();
		this.sort = 'airline';
	}

	// Filter airlines
	filterAirlines() {
		this.listRoutes = [];
		let from_flights = this.getRoute(this.session_flight, 'from');
		from_flights['class'] = 'flight-go';
		let to_flights = {};
		// Check one-way or round-trip
		if (this.session_flight['round_trip'] === 'on') {
			this.round_trip = true;
			to_flights = this.getRoute(this.inverseFlight(this.session_flight), 'to');
			to_flights['class'] = 'flight-back';
			// this.session_flight['to_fly_date'] = moment(this.session_flight['to_date']).format("dddd - DD/MM/YYYY");
		}

		let dep_flights = [];
		let ret_flights = [];

		let airlines = [];
		for(let k in this.airlineOptions) {
			if (this.airlineOptions[k]) {
				airlines.push(k);
			}
		}
		console.log(airlines);
		for (let key in airlines) {
			dep_flights = this.pushDepFlights(airlines[key], this.airlines[airlines[key]], dep_flights);

		}
		from_flights['flights'] = dep_flights;
		this.listRoutes.push(from_flights);


		if (this.session_flight['round_trip'] === 'on') {
			for (let key in airlines) {
				ret_flights = this.pushRetFlights(airlines[key], this.airlines[airlines[key]], ret_flights);

			}
			to_flights['flights'] = ret_flights;
			this.listRoutes.push(to_flights);
		}
	}

	pushDepFlights(type, result, flights) {
		if (result.dep_flights) {
			let image = 'assets/img/' + type + '.gif';
			for (let k in result.dep_flights) {
				result.dep_flights[k].image = image;
				result.dep_flights[k].direction = 'from';
				flights.push(result.dep_flights[k]);
			}
		}
		return flights;
	}

	pushRetFlights(type, result, flights) {
		if (result.ret_flights) {
			let image = 'assets/img/' + type + '.gif';
			for (let k in result.ret_flights) {
				result.ret_flights[k].image = image;
				result.ret_flights[k].direction = 'to';
				flights.push(result.ret_flights[k]);
			}
		}
		return flights;
	}

	// Set Date
	setDate(date, option) {
		this.search = this.clone(this.session_flight);
		if(option === 'from') {
			this.search.from_date = date;
		} else {
			this.search.to_date = date;
		}
		this.selectedStep = 0;
		this.onResearch();
	}


	// Research 
	onResearch() {
		let uuid = UUID.UUID();
		this.sessionStorage.remove('session_flight');
		this.sessionStorage.remove('session_token');
		this.sessionStorage.set('session_token', uuid);

		var objectStore = this.search;
		var dateFormat = 'YYYY-MM-DD';
		var viFormatDate = 'DD/MM/YYYY';
		objectStore.from_date = moment(objectStore.from_date, viFormatDate).format(dateFormat);
		objectStore.from_name = this.getNameFromCode(objectStore.from);

		if (objectStore.to_date == undefined) {
			objectStore.to_date = '';
			objectStore.to_name = '';
		} else {
			objectStore.to_date = moment(objectStore.to_date, viFormatDate).format(dateFormat);
			objectStore.to_name = this.getNameFromCode(objectStore.to);
		}
		console.log(objectStore);
		this.sessionStorage.set('session_flight', JSON.stringify(objectStore));

		this._Router.navigate(['search-result/' + uuid]);
	}

	// Select Flights
	onSelectFlight(flight) {
		if (flight.direction == 'from') {
			this.listRoutes[0]['selectedFlight'] = flight;
		
		}

		if (flight.direction == 'to') {
			this.listRoutes[1]['selectedFlight'] = flight;

		}

		if ((this.session_flight['round_trip'] == 'off' && this.listRoutes[0]['selectedFlight']) || 
			(this.session_flight['round_trip'] == 'on' && this.listRoutes[0]['selectedFlight'] 
				&& this.listRoutes[1]['selectedFlight'])) {
			this.selectedStep = 2;

			this.generateNumberOptions(this.session_flight['adult'], 'Người lớn', 'adult');
			this.generateNumberOptions(this.session_flight['children'], 'Trẻ em', 'children');
			this.generateNumberOptions(this.session_flight['infant'], 'Em bé', 'infant');
			
			
		}

	}

	// generate number options
	generateNumberOptions(n: number, name: string, key: string) {

		for (let i = 1; i <= n; i++) {
			let obj = {title: '', fullname: '', date_of_birth: '', name: name, key: key};
			this.passengers.push(obj);
		}
	}


	// Confirm
	onConfirm() {

		// Insert Booking
		var params: URLSearchParams = new URLSearchParams();
		params.set('code', this.generateCode());
		params.set('round_trip', this.session_flight['round_trip']);
		params.set('adult', this.session_flight['adult']);
		params.set('children', this.session_flight['children']);
		params.set('infant', this.session_flight['infant']);

		this._BookingDataService.create(params).subscribe(res => {
			if(res.status == 'success') {
				let booking = res.data;

				// Insert Booking Detail
				for(let key in this.listRoutes) {

					var params: URLSearchParams = new URLSearchParams();
					params.set('booking_id', booking.id);
					params.set('from', this.listRoutes[key].from);
					params.set('start_date', this.listRoutes[key].selectedFlight.start_date);
					params.set('start_time', this.listRoutes[key].selectedFlight.start_time);

					params.set('to', this.listRoutes[key].to);
					params.set('end_date', this.listRoutes[key].selectedFlight.end_date);
					params.set('end_time', this.listRoutes[key].selectedFlight.end_time);

					params.set('ticket_type', this.listRoutes[key].selectedFlight.type);

					this._BookingDetailDataService.create(params).subscribe(res => {
						if (res.status == 'success') {
							let booking_detail = res.data;
							// Insert Passengers
							for (let k in this.passengers) {
								var params: URLSearchParams = new URLSearchParams();
								params.set('booking_detail_id', booking_detail.id);
								params.set('title', this.passengers[k].title);
								params.set('fullname', this.passengers[k].fullname);
								params.set('date_of_birth', this.passengers[k].date_of_birth);
								params.set('fare', this.listRoutes[key].price);

								this._PassengerDataService.create(params).subscribe(res => {

								});
							}

						}
					});
				}

				// Insert Contact
				var params: URLSearchParams = new URLSearchParams();
				params.set('booking_id', booking.id);
				params.set('title', this.contact['title']);
				params.set('fullname', this.contact['fullname']);
				params.set('phone', this.contact['phone']);
				params.set('email', this.contact['email']);
				params.set('requirement', this.contact['requirement']);

				this._ContactDataService.create(params).subscribe(res => {

				});
			}
		});
		
	}

	// Sort Price From min to max
	sortPrice() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_price = +leftSide.price;
				var right_price = +rightSide.price;
				
				if (left_price < right_price) return -1;
				if (left_price > right_price) return 1;
				return 0;
			})
		}

	}

	// Sort Time From min to max
	sortTime() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_start_time = moment(leftSide.start_time, 'HH:mm');
				var right_start_time = moment(rightSide.start_time, 'HH:mm');

				if (left_start_time < right_start_time) return -1;
				if (left_start_time > right_start_time) return 1;
				return 0;
			})
		}
	}

	// Sort Time From min to max
	sortAirline() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {

				if (leftSide.flight_code < rightSide.flight_code) return -1;
				if (leftSide.flight_code > rightSide.flight_code) return 1;
				return 0;
			})
		}
	}

	selectPlaneOption(round_trip) {
		if (round_trip == 'off') {
			jQuery('#date-back input').prop('disabled', true);
		} else {
			jQuery('#date-back input').prop('disabled', false);
		}
	}

	// Inverse Flight
  	protected inverseFlight(session_flight) {
		var temp = this.clone(session_flight);
		temp['from'] = session_flight['to'];
		temp['from_name'] = session_flight['to_name'];
		temp['to'] = session_flight['from'];
		temp['to_name'] = session_flight['from_name'];
		temp['from_date'] = session_flight['to_date'];
		return temp;

  	}

	// Get Lowest Price 
	getLowestPrice(data) {
		let arr = [];
		for (var key in data) {
			arr.push(data[key].price);
		}
		return this.min(arr);

	}

	min(array) {
		return Math.min.apply(Math, array);
	};

  	// Get Route
  	protected getRoute(route, option) {
		route['from_fly_date'] = moment(route['from_date']).format(this._Configuration.formatDate);
		route['days'] = [];
		route['days'].push(this.getDateObject(-3, route['from_date']));
		route['days'].push(this.getDateObject(-2, route['from_date']));
		route['days'].push(this.getDateObject(-1, route['from_date']));
		route['days'].push(this.getDateObject(0, route['from_date'], true));
		route['days'].push(this.getDateObject(1, route['from_date']));
		route['days'].push(this.getDateObject(2, route['from_date']));
		route['days'].push(this.getDateObject(3, route['from_date']));
		route['option'] = option;
		
		return route;
  	}

  	// Get Date Object
	protected getDateObject(number, date, isCurrent = false) {
		var item = {};
		var format = 'DD-MM-YYYY';
		var currentDate = String(moment().format(format));
		var momentDate = moment(date).add(number, 'days');
		item['date'] = momentDate.format('DD/MM/YYYY');
		item['name'] = momentDate.format('dddd');
		item['class'] = '';
		if(isCurrent) {
			item['class'] = 'current';
		} else {

			if (moment(currentDate, format) > moment(momentDate, format)) {
				item['class'] = 'off';
			}
		}
		return item;

  	}

	// Get Name From Code
	protected getNameFromCode(code: string) {
		let label = '';
		for (var key in this.locations) {
			if (this.locations[key].value == code)
				return this.locations[key].label;
		}
		return label;
	}

  	protected clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	protected generateCode() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 6; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

}
