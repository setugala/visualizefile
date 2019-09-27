import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Sort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  	title = 'my-app';
	dataLoaded: Boolean = false;
	dataSource: MatTableDataSource<any> ;
	displayedColumns: any;
	fileName: any;
  	progressValue: Number;

	@ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  	@ViewChild(MatSort,{static: false}) sort: MatSort;
  
	constructor(private _snackBar: MatSnackBar){
  		this.displayedColumns = ['FirstName', 'SurName', 'Issue count', 'DateofBirth'];
  		this.dataSource= new MatTableDataSource<any>();
	}

	ngAfterViewInit() {
    	this.dataSource.paginator = this.paginator;
    	this.dataSource.sort = this.sort;
  	}

	applyFilter(filterValue: string) {
    	filterValue = filterValue.trim();
    	filterValue = filterValue.toLowerCase();
    	this.dataSource.filter = filterValue;
  	}
  
  	uploadFile(event){
 		const fileObj = event.target.files[0]; 
    	this.fileName = fileObj.name.substring(0, fileObj.name.lastIndexOf('.'));
		const re = /(\.xls|\.xlsx|\.csv)$/i;
      	if(!re.exec(fileObj.name)){
        	this._snackBar.open('Unsupported File Format. Please upload a csv/xls/xlsx file.','Ok',{
          		horizontalPosition: 'center',
          		verticalPosition: 'top',
        	});
        	this.progressValue=0;
        	this.dataLoaded= false;
      	} else{  
    		let reader = new FileReader();
 
			if(event.target.files && event.target.files.length) {
      			const [file] = event.target.files;
      			reader.readAsBinaryString(file);
      			reader.onload = () => {
        			var fileData = reader.result;
        			var wb = XLSX.read(fileData, {type : 'binary', cellDates:true, cellNF: false, cellText:false});
        			var headerNames = XLSX.utils.sheet_to_json( wb.Sheets[wb.SheetNames[0]],{dateNF:"YYYY-MM-DD", header: 1 })[0];
			       	wb.SheetNames.forEach((sheetName)=>{
            			let rowObj =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            			this.dataLoaded= true;
            			this.dataSource= new MatTableDataSource(rowObj);
           				this.dataSource.paginator = this.paginator;
           				this.dataSource.sort = this.sort;
        			});
      			};
      		}
    	}
  	}
}


