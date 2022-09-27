import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from './api.service';
import { DialogComponent } from './dialog/dialog.component';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'productCategory', 'date','stateOfProduct', 'price','description', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private api: ApiService) {}

    ngOnInit(): void {
      this.getProducts()
    }

  openDialog() {
    this.dialog.open(DialogComponent, {
    //  width: '35%'
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getProducts()
      }
    })
  }

  getProducts(){
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error something')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(row: any){
    this.dialog.open(DialogComponent, {
      data: row
    }).afterClosed().subscribe(val => {
      if(val === 'update'){
        this.getProducts();
      }
    })
  }

  onDelete(id: number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=> {
        alert('Deleted product')
        this.getProducts();
      },
      error: ()=> {
        alert('Error deleting')
      }
    })
  }


}

