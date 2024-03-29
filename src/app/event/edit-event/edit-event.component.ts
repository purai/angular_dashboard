import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { EventService } from '../../service/event.service';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../model/category.model';
import { SalePlaceService } from '../../service/salePlace.service';
import { SalePlace } from '../../model/salePlace.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.min.css']
})
export class EditEventComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private eventService: EventService,
              private categoryService: CategoryService,
              private salePlaceService: SalePlaceService) { }

  statusFormatted;
  featuredFormatted;
  editForm: FormGroup;
  fileSelected: File = null;
  categories: Category[];
  salePlaces: SalePlace[];

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      id: [],
      uuid: [],
      status: ['', Validators.required],
      featured: [],
      title: ['', Validators.required],
      image: [''],
      about: [''],
      price: [''],
      created_at: [],
      updated_at: [],
      date: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      id_category: ['', Validators.required],
      id_sale_place: ['', Validators.required]
    });

    this.loadEvents();
    console.log(this.editForm.get('date'));

    this.loadCategories();
    this.loadSalePlaces();
  }

  onFileSelected(event) {
    this.fileSelected = <File>event.target.files[0];
    this.editForm.get('image').setValue(this.fileSelected, this.fileSelected.name);
  }

  loadEvents() {
    const eventUuid = localStorage.getItem('editEventUuid');
    const eventStatus = localStorage.getItem('editEventStatus');

    if (!eventUuid) {
      this.snackBar.open('Invalid action.', 'Not nice');
      this.router.navigate(['list-event']);
      return;
    }

    this.eventService.getEventByUuid(eventUuid, parseInt(eventStatus, 2))
      .subscribe(
        res => {
          this.editForm.setValue(res['events'][0]);
        },
        err => {
          this.snackBar.open(err, 'Not nice');
        }
      );
  }

  loadCategories() {
    this.categoryService.getCategories(1, 0)
      .subscribe(
        res => {
          this.categories = res['categories'];
        },
        () => {
          this.snackBar.open('Could not load categories. Check server.', 'Okay');
        }
      );
  }

  loadSalePlaces() {
    this.salePlaceService.getSalePlaces(1, 0)
      .subscribe(
        res => {
          this.salePlaces = res['sale_places'];
        },
        () => {
          this.snackBar.open('Could not load sale places. Check server.', 'Okay');
        }
      );
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.snackBar.open('Invalid form. Try again', 'Okay');
      return;
    }

    this.statusFormatted = this.editForm.get('status').value === true ? '1' : this.editForm.get('status').value;
    this.featuredFormatted = this.editForm.get('featured').value === true ? '1' : this.editForm.get('featured').value;

    const formData = new FormData();
    formData.append('id', this.editForm.get('id').value);
    formData.append('uuid', this.editForm.get('uuid').value);
    formData.append('status', this.statusFormatted);
    formData.append('featured', this.featuredFormatted);
    formData.append('title', this.editForm.get('title').value);
    formData.append('about', this.editForm.get('about').value);
    formData.append('price', this.editForm.get('price').value);

    if (this.fileSelected != null) {
      formData.append('image', this.fileSelected, this.fileSelected.name);
    }

    formData.append('created_at', this.editForm.get('created_at').value);
    formData.append('updated_at', this.editForm.get('updated_at').value);
    formData.append('date', this.editForm.get('date').value);
    formData.append('address', this.editForm.get('address').value);
    formData.append('city', this.editForm.get('city').value);
    formData.append('id_category', this.editForm.get('id_category').value);
    formData.append('id_sale_place', this.editForm.get('id_sale_place').value);

    this.eventService.updateEvent(formData)
      .pipe(first())
      .subscribe(
        res => {
          this.snackBar.open(res['message'], 'Nice');
          this.router.navigate(['list-event']);
        },
        err => {
          this.snackBar.open(err, 'Not nice');
        }
      );
  }
}
