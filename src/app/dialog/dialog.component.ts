import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  productState = ["New", "Second Hand", "Old"];
  productForm!: FormGroup;
  actionButton: string = 'Submit';

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      date: ['', Validators.required],
      stateOfProduct: ['', Validators.required],
      price: ['', Validators.required],
      description: ['']
    })

    if(this.editData){
      this.actionButton = 'Update'
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['productCategory'].setValue(this.editData.productCategory)
      this.productForm.controls['date'].setValue(this.editData.date)
      this.productForm.controls['stateOfProduct'].setValue(this.editData.stateOfProduct)
      this.productForm.controls['price'].setValue(this.editData.price)
      this.productForm.controls['description'].setValue(this.editData.description)

    }
  }

  addProduct(){
  //  console.log(this.productForm.value)
  if(!this.editData){
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value).subscribe({
        next: (res) => {
          alert('Product added successfully');
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          alert('Something went wrong')
        }
      })
    }
  }
  else {
    this.updateProduct()
  }
  }
updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Product updated');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: ()=>{
        alert('Error something')
      }
    })
  }

  
}
