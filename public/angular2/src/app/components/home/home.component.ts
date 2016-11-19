import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
	FormArray
} from "@angular/forms";
import { LocalStorageService } from 'angular-2-local-storage';
import { SelectModule } from 'angular2-select';
import { UUID } from 'angular2-uuid';

import { BannerComponent } from './banner';
import { NewsComponent } from './news';
import { CommentComponent } from './comment';
import { Location } from '../../models/Location';

import { Configuration } from '../../shared/app.configuration';
import { LocationDataService } from '../../shared/location.dataservice';
import { BannerDataService } from '../../shared/banner.dataservice';
declare let jQuery: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [BannerComponent, NewsComponent, BannerComponent, LocationDataService, BannerDataService]
})
export class HomeComponent implements OnInit, AfterViewInit {
	people = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	locations = [];
	myForm: FormGroup;

	myDatePickerOptions = {
		todayBtnTxt: 'Today',
		dateFormat: 'yyyy-mm-dd',
		firstDayOfWeek: 'mo',
		sunHighlight: true,
		height: '34px',
		width: '260px',
		inline: false,
		disableUntil: { year: 2016, month: 8, day: 10 },
		selectionTxtFontSize: '16px'
	};




	constructor(private formBuilder: FormBuilder, private locationDataService: LocationDataService, private _configuration: Configuration,
		private _bannerDataService: BannerDataService, private sessionStorage: LocalStorageService,
		private router: Router) { 

		this.myForm = formBuilder.group({
			'round_trip': 'off',
			'from': ['', Validators.required],
			'to': ['', Validators.required],
			'from_date': ['', Validators.required],
			// 'plan_option': ['', Validators.required],
			'adult': ['1', Validators.required],
			'children': ['0'],
			'infant': ['0']
		});

		this.myForm.statusChanges.subscribe(
			(data: any) => console.log(data)
		);

		this.locationDataService.getAll().subscribe(res => {

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

	

	ngOnInit() {
		
	}

	ngAfterViewInit() {
		setTimeout(function() {
			jQuery('.owl-carousel').owlCarousel({
				navigation: false,
				slideSpeed: 300,
				paginationSpeed: 400,
				singleItem: true,
				autoPlay: 5000
			});
		}, 500);
	}
	
	onSubmit() {
		let uuid = UUID.UUID();
		this.sessionStorage.remove('session_flight');
		this.sessionStorage.remove('session_token');
		this.sessionStorage.set('session_token', uuid);

		var objectStore = this.myForm.value;
		objectStore.from_date = '2016-11-20';
		this.sessionStorage.set('session_flight', JSON.stringify(objectStore));
		this.router.navigate(['search-result']);
	}

	onDateChanged(event: any) {
		console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
	}

}
